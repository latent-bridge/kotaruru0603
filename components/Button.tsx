"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { TOKENS } from "@/lib/data";

type Props = {
  primary?: boolean;
  small?: boolean;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
};

export function Button({ primary, small, children, href, onClick }: Props) {
  const [hover, setHover] = useState(false);
  const pad = small ? "8px 12px" : "12px 18px";
  const fs = small ? 11 : 12;
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    border: primary ? `1px solid ${TOKENS.mint}` : "1px solid rgba(255,255,255,0.18)",
    background: primary ? TOKENS.mint : "transparent",
    color: primary ? "#06070a" : TOKENS.textPrimary,
    fontFamily: TOKENS.mono,
    fontSize: fs,
    letterSpacing: "0.14em",
    padding: pad,
    borderRadius: 4,
    fontWeight: 700,
    transition: "transform .15s, box-shadow .15s",
    transform: hover ? "translateY(-1px)" : undefined,
    boxShadow: hover
      ? primary
        ? `0 6px 22px ${TOKENS.mint}55`
        : "0 4px 14px rgba(0,0,0,0.4)"
      : undefined,
    textDecoration: "none",
  };

  const common = {
    style,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };

  if (href) {
    const external = /^https?:\/\//.test(href);
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...common}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} {...common}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} {...common}>
      {children}
    </button>
  );
}
