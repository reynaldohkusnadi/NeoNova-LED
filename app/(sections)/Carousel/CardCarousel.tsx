import React from "react";
import type { Card } from "@/content/site";

interface CardCarouselProps {
  cards: [Card, Card, Card];
}

export default function CardCarousel({ cards }: CardCarouselProps) {
  return (
    <section aria-label="Highlights" className="w-full max-w-5xl mx-auto" data-carousel>
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <article
            key={card.id}
            tabIndex={0}
            className="rounded-lg border p-4 outline-none focus-visible:outline focus-visible:outline-2"
          >
            <div className="text-xs uppercase tracking-wide opacity-60 mb-1">
              {card.id}
            </div>
            <h3 className="font-medium mb-1">{card.headline}</h3>
            <p className="opacity-80 text-sm">{card.blurbShort}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
