"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavItem } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Labels = {
  open: string;
  close: string;
  title: string;
  mainNav: string;
  secondaryNav: string;
};

type Props = {
  main: NavItem[];
  bottom: NavItem[];
  labels: Labels;
};

const SIDEBAR_ID = "site-sidebar";

/** Compare paths ignoring trailing slashes and hashes. */
const normalise = (p: string) => p.split("#")[0]!.replace(/\/+$/, "") || "/";

/**
 * Left slide-in sidebar (docs/COMPONENTS.md). Built on Radix Dialog for focus trapping,
 * Esc / overlay-click to close, scroll lock and correct aria-expanded/aria-controls on the trigger.
 * Sub-categories are always visible and indented: never a dropdown.
 */
export function Sidebar({ main, bottom, labels }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = normalise(pathname ?? "/");
  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-controls={SIDEBAR_ID}
        className="-ml-2.5 inline-flex size-11 items-center justify-center text-ink transition-colors duration-200 hover:text-accent"
      >
        <Menu className="size-6" strokeWidth={1.5} aria-hidden="true" />
        <span className="sr-only">{labels.open}</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-scrim data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content
          id={SIDEBAR_ID}
          aria-describedby={undefined}
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[min(88vw,380px)] flex-col bg-white shadow-[0_0_40px_rgb(0_0_0/0.08)] outline-none",
            "data-[state=closed]:animate-drawer-out data-[state=open]:animate-drawer-in",
          )}
        >
          <Dialog.Title className="sr-only">{labels.title}</Dialog.Title>

          <div className="flex h-(--header-height) shrink-0 items-center justify-end px-4 sm:px-6">
            <Dialog.Close className="-mr-2.5 inline-flex size-11 items-center justify-center text-ink transition-colors duration-200 hover:text-accent">
              <X className="size-6" strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only">{labels.close}</span>
            </Dialog.Close>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-8 pt-4 pb-8 sm:px-10">
            <nav aria-label={labels.mainNav}>
              <SidebarList items={main} current={current} onNavigate={close} level={1} />
            </nav>

            <nav aria-label={labels.secondaryNav} className="mt-auto border-t border-hairline pt-6">
              <SidebarList items={bottom} current={current} onNavigate={close} level="bottom" />
            </nav>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SidebarList({
  items,
  current,
  onNavigate,
  level,
}: {
  items: NavItem[];
  current: string;
  onNavigate: () => void;
  level: 1 | 2 | "bottom";
}) {
  return (
    <ul
      className={cn(
        level === 1 && "space-y-7",
        level === 2 && "mt-4 ml-1 space-y-3 border-l border-hairline pl-5",
        level === "bottom" && "space-y-3",
      )}
    >
      {items.map((item) => {
        const isCurrent = normalise(item.href) === current;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "link-grow transition-colors duration-200",
                level === 1 && "text-nav text-ink uppercase",
                level === 2 && "text-[15px] font-light tracking-[0.02em] text-muted",
                level === "bottom" && "text-body-sm tracking-[0.04em] text-muted",
                "hover:text-accent",
                isCurrent && "text-accent",
              )}
            >
              {item.label}
            </Link>
            {item.children && item.children.length > 0 && (
              <SidebarList
                items={item.children}
                current={current}
                onNavigate={onNavigate}
                level={2}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
