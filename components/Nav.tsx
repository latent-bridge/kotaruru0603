"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PALETTE } from "@/lib/mochi";

const NAV_ITEMS: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/", label: "おうち" },
  { href: "/schedule", label: "よてい" },
  { href: "/archive", label: "おもいで" },
  { href: "/chat", label: "ざつだん" },
];

export function Nav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="flex items-center gap-2 md:gap-3 flex-wrap mt-3 md:mt-4">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              background: active
                ? `linear-gradient(180deg, transparent 55%, ${PALETTE.cream}cc 85%)`
                : "transparent",
              border: `2px solid transparent`,
              fontSize: 12,
              fontWeight: active ? 900 : 700,
              color: PALETTE.ink,
              textDecoration: "none",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
