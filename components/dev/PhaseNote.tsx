import type { ReactNode } from "react";

/**
 * TEMPORARY scaffolding shown on route stubs during the build-out, so reviewers can see
 * which phase completes each page. Remove every usage by the end of Phase 4.
 */
export function PhaseNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-12 inline-block border border-dashed border-stone px-4 py-2 text-caption text-muted">
      {children}
    </p>
  );
}
