"use client";

import type { Card } from "@/content/site";

interface ClientCarouselProps {
  cards: [Card, Card, Card];
}

export default function ClientCarousel({ cards }: ClientCarouselProps) {
  return (
    <section className="w-full max-w-5xl mx-auto grid sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.id} className="rounded-lg border p-4">
          <h3 className="font-medium mb-1">{card.headline}</h3>
          <p className="opacity-80 text-sm">{card.blurbShort}</p>
        </div>
      ))}
    </section>
  );
}


