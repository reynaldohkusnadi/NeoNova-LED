import React from "react";
import { content } from "@/content/site";

export default function NavbarMinimal() {
  const { ctaPrimary, ctaSecondary } = content.form;
  return (
    <header
      className="sticky top-0 z-[var(--nn-z-header)] h-16 flex items-center border-b bg-[color-mix(in_oklab,var(--background)_92%,black)] backdrop-blur supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--background)_85%,black)]"
    >
      <nav
        className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between"
        aria-label="Primary"
      >
        <a href="#" className="font-medium">Neo Nova</a>
        <div className="flex gap-3 items-center">
          <a
            href="#"
            data-analytics-event="cta_click_secondary"
            className="px-3 py-2 rounded-md border"
          >
            {ctaSecondary}
          </a>
          <a
            href="#"
            data-analytics-event="cta_click_primary"
            className="px-3 py-2 rounded-md bg-[var(--nn-foreground)] text-[var(--nn-primary-contrast)] dark:bg-white dark:text-[var(--nn-foreground)]"
          >
            {ctaPrimary}
          </a>
        </div>
      </nav>
    </header>
  );
}


