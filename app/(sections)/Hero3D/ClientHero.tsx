"use client";

interface ClientHeroProps {
  headline: string;
}

export default function ClientHero({ headline }: ClientHeroProps) {
  return (
    <div className="sr-only" aria-hidden>
      {headline}
    </div>
  );
}


