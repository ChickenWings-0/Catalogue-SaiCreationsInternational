"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** Copies the product code (Instagram can't prefill a message, so this helps users quote it). */
export function CopyCodeButton({
  code,
  label,
  copiedLabel,
}: {
  code: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable: the code is visible on the page anyway */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-11 items-center gap-2 eyebrow text-muted transition-colors hover:text-ink"
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
