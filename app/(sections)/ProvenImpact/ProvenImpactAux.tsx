import React from "react";
import type { Card } from "@/content/site";

interface ProvenImpactAuxProps {
  card?: Card;
  mode?: "carousel-card" | "intro";
}

export default function ProvenImpactAux({ card, mode = "intro" }: ProvenImpactAuxProps) {
  if (!card) return null;

  if (mode === "carousel-card") {
    return (
      <article
        tabIndex={0}
        className="rounded-lg border p-4 outline-none focus-visible:outline focus-visible:outline-2"
      >
        <div className="text-xs uppercase tracking-wide opacity-60 mb-1">{card.id}</div>
        <h3 className="font-medium mb-1">{card.headline}</h3>
        <p className="opacity-80 text-sm">{card.blurbShort}</p>
      </article>
    );
  }

  // intro mode
  return (
    <section aria-label="Proven Impact" className="w-full max-w-3xl mx-auto py-8">
      <h2 className="text-xl font-semibold mb-2">{card.headline}</h2>
      <p className="opacity-80">{card.blurbShort}</p>
    </section>
  );
}


