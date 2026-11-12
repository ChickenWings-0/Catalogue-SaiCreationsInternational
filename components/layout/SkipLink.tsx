export function SkipLink({ label, target = "#main" }: { label: string; target?: string }) {
  return (
    <a
      href={target}
      className="sr-only z-50 bg-ink px-5 py-3 eyebrow text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      {label}
    </a>
  );
}
