"use client";

/*
 * The Studio scroll sequence (docs/STUDIO_INTERACTION_SPEC.md):
 *   1. expand  – the inset video's clip-path scrubs open to full screen
 *   2. hold    – deliberate dead zone: nothing moves while the user keeps scrolling
 *   3. reveal  – an ivory panel with the photo carousel fades in over the video
 *   4. release – the pin ends; the carousel scrolls on in normal flow
 * Layout for each mode is in globals.css (.studio-*). Reduced motion, no JS, or short
 * landscape screens get a static stacked layout with no pinning.
 */

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import type { Labels, StudioPage } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { PhotoCarousel } from "./PhotoCarousel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ANIMATED_QUERY = "(prefers-reduced-motion: no-preference) and (min-height: 500px)";

type Props = {
  video: StudioPage["video"];
  carousel: StudioPage["carousel"];
  /** Scroll distances in viewport heights (configurable in content/pages/studio.ts). */
  expandDistanceVh?: number;
  deadZoneVh?: number;
  revealDistanceVh?: number;
  labels: { video: Labels["video"]; carousel: Labels["carousel"] };
  /** Shows ScrollTrigger markers (development only). */
  debug?: boolean;
};

type Source = { src: string; type: string };

export function StudioScrollVideo({
  video,
  carousel,
  expandDistanceVh = 100,
  deadZoneVh = 80,
  revealDistanceVh = 60,
  labels,
  debug = false,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLParagraphElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const stagePlayRef = useRef<HTMLButtonElement>(null);
  const userPaused = useRef(false);
  const covered = useRef(false);

  const [sources, setSources] = useState<Source[]>([]);
  const [playing, setPlaying] = useState(false);

  // ─── Video: choose sources after mount (mobile encode < 768px, none with data-saver) ──
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return; // poster only
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const list: Source[] = [];
    if (mobile && video.srcMobile) list.push({ src: video.srcMobile, type: "video/mp4" });
    else {
      if (video.srcWebm) list.push({ src: video.srcWebm, type: "video/webm" });
      list.push({ src: video.src, type: "video/mp4" });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sources depend on the device, known only after mount
    setSources(list);
  }, [video.src, video.srcMobile, video.srcWebm]);

  const tryPlay = useCallback(() => {
    const v = videoRef.current;
    if (!v || userPaused.current || covered.current) return;
    v.play().catch(() => setPlaying(false)); // autoplay blocked (e.g. Low Power Mode): poster stays
  }, []);

  // Load new sources; autoplay only when motion is allowed and the stage is on screen.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !sources.length) return;
    v.load();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) userPaused.current = true; // user starts it with the play button
    const io = new IntersectionObserver(([e]) => (e?.isIntersecting ? tryPlay() : v.pause()), {
      threshold: 0.15,
    });
    if (stageRef.current) io.observe(stageRef.current);
    const onVis = () => (document.hidden ? v.pause() : tryPlay());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [sources, tryPlay]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      covered.current = false;
      tryPlay();
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  // ─── Scroll timeline ─────────────────────────────────────────────────────────
  useGSAP(
    () => {
      ScrollTrigger.config({ ignoreMobileResize: true });
      const mm = gsap.matchMedia();

      mm.add({ animated: ANIMATED_QUERY, mobile: "(max-width: 767px)" }, (ctx) => {
        const { animated, mobile } = ctx.conditions as { animated: boolean; mobile: boolean };
        if (!animated) return;

        const panel = panelRef.current!;
        const vh = () => window.innerHeight / 100;
        const d = {
          expand: expandDistanceVh,
          hold: mobile ? Math.min(deadZoneVh, 50) : deadZoneVh,
          reveal: mobile ? Math.min(revealDistanceVh, 40) : revealDistanceVh,
        };
        const inset = mobile ? "inset(22svh 16px round 4px)" : "inset(18svh 12vw round 4px)";
        const setInteractive = (on: boolean) => {
          panel.inert = !on;
        };
        setInteractive(false);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top top",
            end: () => `+=${(d.expand + d.hold + d.reveal) * vh()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: debug,
            // Released: the panel fully covers the video, so pause it; resume when scrolling back.
            onLeave: () => {
              setInteractive(true);
              covered.current = true;
              videoRef.current?.pause();
            },
            onEnterBack: () => {
              setInteractive(false);
              covered.current = false;
              tryPlay();
            },
          },
        });

        tl.addLabel("expand")
          .fromTo(
            videoWrapRef.current,
            { clipPath: inset },
            { clipPath: "inset(0px 0px round 0px)", duration: d.expand },
          )
          .fromTo(scrimRef.current, { opacity: 0 }, { opacity: 0.15, duration: d.expand }, "<")
          // The play/pause control rides along with the frame's bottom-left corner.
          .fromTo(
            stagePlayRef.current,
            {
              left: () => (mobile ? 16 : window.innerWidth * 0.12) + 16,
              bottom: () => window.innerHeight * (mobile ? 0.22 : 0.18) + 16,
            },
            { left: 24, bottom: 24, duration: d.expand },
            "<",
          )
          .addLabel("hold")
          .fromTo(
            cueRef.current,
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: d.hold * 0.15 },
          )
          .to({}, { duration: d.hold * 0.85 }) // ← the dead zone: scroll passes, nothing moves
          .addLabel("reveal")
          .to(cueRef.current, { autoAlpha: 0, duration: d.reveal * 0.2 })
          .fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: d.reveal }, "<")
          .fromTo(
            panel.querySelectorAll("[data-studio-item]"),
            { y: 48, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: d.reveal * 0.08, duration: d.reveal * 0.6 },
            `<+=${d.reveal * 0.3}`,
          )
          .addLabel("release");

        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        return () => setInteractive(true);
      });
    },
    { scope: rootRef, dependencies: [expandDistanceVh, deadZoneVh, revealDistanceVh, debug] },
  );

  const refresh = useCallback(() => ScrollTrigger.refresh(), []);

  const playButton = (className: string, ref?: React.Ref<HTMLButtonElement>) => (
    <button
      ref={ref}
      type="button"
      onClick={togglePlay}
      aria-label={playing ? labels.video.pause : labels.video.play}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur-sm transition-colors hover:bg-white",
        className,
      )}
    >
      {playing ? (
        <Pause className="size-4" strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Play className="ml-0.5 size-4" strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  );

  return (
    <div ref={rootRef}>
      <div ref={stageRef} className="studio-stage bg-ivory">
        <div
          ref={videoWrapRef}
          className="studio-video relative mx-auto aspect-video max-w-(--container-content) overflow-hidden bg-ink"
        >
          {/* Poster is a real image so it's optimised and preloaded (LCP). */}
          <ResponsiveImage
            image={{ ...video.poster, decorative: true }}
            fill
            sizes="100vw"
            preload
          />
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            aria-hidden="true"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            {sources.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>
          <div ref={scrimRef} className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
          {/* Static layout (reduced motion / no pinning): inside the video frame. */}
          {playButton("studio-play-inline absolute bottom-4 left-4")}
        </div>

        <p
          ref={cueRef}
          className="studio-cue pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-ink/55 px-5 py-2.5 eyebrow whitespace-nowrap text-white opacity-0 backdrop-blur-sm"
          aria-hidden="true"
        >
          {labels.video.scrollCue}
          <ChevronDown className="size-3.5" aria-hidden="true" />
        </p>

        {/* Animated layout: follows the frame corner as the video expands (hidden in static layout). */}
        {playButton("studio-play-stage", stagePlayRef)}

        <div
          ref={panelRef}
          className="studio-panel relative flex flex-col items-center justify-center overflow-hidden bg-ivory pt-[calc(var(--header-height)+2rem)] pb-10"
        >
          {carousel.heading && (
            <h2
              data-studio-item
              className="mb-8 px-4 text-center font-display text-display-md text-ink lg:mb-10"
            >
              {carousel.heading}
            </h2>
          )}
          <div data-studio-item className="w-full">
            <PhotoCarousel
              slides={carousel.slides}
              autoplay={carousel.autoplay}
              autoplayDelayMs={carousel.autoplayDelayMs}
              labels={labels.carousel}
              onReady={refresh}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
