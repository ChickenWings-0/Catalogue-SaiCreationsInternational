import Link from "next/link";

// Phase 0 stub. Replaced by the real Home page in Phase 2.
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="eyebrow text-muted">Phase 0</p>
      <h1 className="font-display text-display-lg font-light">SAI CREATIONS INTERNATIONAL</h1>
      <Link href="/styleguide/" className="link-grow eyebrow text-accent">
        View style guide
      </Link>
    </main>
  );
}
