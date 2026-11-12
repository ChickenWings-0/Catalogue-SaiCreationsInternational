"use client";

/*
 * TEMPORARY: floating colour-palette switcher for client review.
 * Enabled by `features.showPaletteSwitcher` in content/site.ts. Remove with lib/palettes.ts
 * and app/palettes.css when a palette has been chosen.
 */

import { Check, Link2, Palette as PaletteIcon, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import {
  DEFAULT_PALETTE,
  PALETTE_QUERY_PARAM,
  PALETTE_STORAGE_KEY,
  PALETTE_UI,
  PALETTES,
  type PaletteId,
} from "@/lib/palettes";
import { cn } from "@/lib/utils";

const SWATCHES = ["bg-ivory", "bg-linen", "bg-greige", "bg-ink", "bg-accent", "bg-cta"] as const;

function readCurrent(): PaletteId {
  const attr = document.documentElement.getAttribute("data-palette");
  return (PALETTES.find((p) => p.id === attr)?.id ?? DEFAULT_PALETTE) as PaletteId;
}

function apply(id: PaletteId) {
  const root = document.documentElement;
  if (id === DEFAULT_PALETTE) root.removeAttribute("data-palette");
  else root.setAttribute("data-palette", id);
  try {
    localStorage.setItem(PALETTE_STORAGE_KEY, id);
  } catch {
    /* storage unavailable (private mode): the choice lasts for this page view */
  }
  // Keep ?palette= in the address bar so the current URL can be shared as-is.
  const url = new URL(window.location.href);
  url.searchParams.set(PALETTE_QUERY_PARAM, id);
  window.history.replaceState(window.history.state, "", url);
}

export function PaletteSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<PaletteId>(DEFAULT_PALETTE);
  const [copied, setCopied] = useState(false);
  const [manualUrl, setManualUrl] = useState<string | null>(null);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sync with the palette applied by the inline boot script before hydration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the DOM after hydration
    setCurrent(readCurrent());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const choose = (id: PaletteId) => {
    apply(id);
    setCurrent(id);
    setCopied(false);
    setManualUrl(null);
  };

  const copyLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set(PALETTE_QUERY_PARAM, current);
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
    } catch {
      setManualUrl(url.toString()); // clipboard blocked: show the link to copy by hand
    }
  };

  return (
    <div
      ref={rootRef}
      className="fixed right-4 bottom-4 z-30 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6"
    >
      {open && (
        <div
          id={panelId}
          role="region"
          aria-label={PALETTE_UI.title}
          className="w-[min(calc(100vw-2rem),340px)] border border-hairline bg-white p-5 shadow-float"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="eyebrow text-ink">{PALETTE_UI.title}</p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
              className="-mr-2 inline-flex size-9 items-center justify-center text-muted hover:text-ink"
              aria-label={PALETTE_UI.close}
            >
              <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <fieldset>
            <legend className="sr-only">{PALETTE_UI.title}</legend>
            <ul className="space-y-2">
              {PALETTES.map((p) => {
                const active = p.id === current;
                return (
                  <li key={p.id}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-3 border p-3 transition-colors duration-200",
                        "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-indigo",
                        active ? "border-ink" : "border-hairline hover:border-stone",
                      )}
                    >
                      <input
                        type="radio"
                        name="palette"
                        value={p.id}
                        checked={active}
                        onChange={() => choose(p.id)}
                        className="sr-only"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-body-sm font-medium text-ink">
                          {p.name}
                          {active && (
                            <span className="inline-flex items-center gap-1 eyebrow text-[10px] text-accent">
                              <Check className="size-3" aria-hidden="true" />
                              {PALETTE_UI.current}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-caption text-muted">
                          {p.description}
                        </span>
                        {/* Swatches read the palette's own CSS variables via data-palette. */}
                        <span data-palette={p.id} className="mt-2 flex gap-1" aria-hidden="true">
                          {SWATCHES.map((s) => (
                            <span key={s} className={cn(s, "size-5 border border-hairline")} />
                          ))}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          <button
            type="button"
            onClick={copyLink}
            className="mt-4 inline-flex items-center gap-2 eyebrow text-ink hover:text-accent"
          >
            <Link2 className="size-3.5" aria-hidden="true" />
            {copied ? PALETTE_UI.copied : PALETTE_UI.copyLink}
          </button>
          {manualUrl && (
            <input
              readOnly
              value={manualUrl}
              aria-label={PALETTE_UI.copyLink}
              onFocus={(e) => e.currentTarget.select()}
              className="mt-2 w-full border border-hairline bg-ivory px-2 py-1.5 text-caption"
            />
          )}
          <p className="mt-2 text-caption text-muted" aria-live="polite">
            {PALETTE_UI.note}
          </p>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        aria-label={PALETTE_UI.open}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex size-12 items-center justify-center rounded-full border border-hairline bg-white text-ink shadow-float transition-colors duration-200 hover:text-accent"
      >
        <PaletteIcon className="size-5" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}
