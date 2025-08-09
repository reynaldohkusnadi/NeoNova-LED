import React from "react";
import type { Card } from "@/content/site";
import ScrollStack, { ScrollStackItem } from "@/app/(sections)/Carousel/ScrollStack";

interface CardCarouselProps {
  cards: [Card, Card, Card];
}

export default function CardCarousel({ cards }: CardCarouselProps) {
  return (
    <section aria-label="Highlights" className="w-full max-w-5xl mx-auto" data-carousel>
      <ScrollStack className="mt-6" itemDistance={120} itemScale={0.04} itemStackDistance={28} baseScale={0.88} rotationAmount={1} blurAmount={0.8}>
        {cards.map((card) => (
          <ScrollStackItem key={card.id}>
            <article
              tabIndex={0}
              className="rounded-lg border p-4 outline-none focus-visible:outline focus-visible:outline-2 bg-[var(--background)]"
              data-card-id={card.id}
            >
              <div className="text-xs uppercase tracking-wide opacity-60 mb-1">{card.id}</div>
              <h3 className="font-medium mb-1">{card.headline}</h3>
              <p className="opacity-80 text-sm">{card.blurbShort}</p>
            </article>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}
