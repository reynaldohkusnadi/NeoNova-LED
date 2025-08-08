"use client";

interface SlideOverFormProps {
  ctaPrimary: string;
  ctaSecondary: string;
}

export default function SlideOverForm({ ctaPrimary, ctaSecondary }: SlideOverFormProps) {
  return (
    <section className="w-full max-w-xl mx-auto text-center py-8">
      <div className="flex gap-3 justify-center">
        <button className="px-4 py-2 rounded-md bg-[var(--nn-foreground)] text-[var(--nn-primary-contrast)] dark:bg-white dark:text-[var(--nn-foreground)]">
          {ctaPrimary}
        </button>
        <button className="px-4 py-2 rounded-md border">{ctaSecondary}</button>
      </div>
    </section>
  );
}


