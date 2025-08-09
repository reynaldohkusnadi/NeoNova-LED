import React from "react";
import type { Stat } from "@/content/site";

interface ResultsBandProps {
  stats: [Stat, Stat];
}

export default function ResultsBand({ stats }: ResultsBandProps) {
  return (
    <section
      aria-label="Key results"
      className="w-full max-w-3xl mx-auto py-8"
      role="region"
    >
      <div className="grid grid-cols-2 gap-4" data-results-band>
        {stats.map((s) => (
          <div
            key={s.label}
            tabIndex={0}
            className="rounded-lg border p-4 text-center outline-none focus-visible:outline focus-visible:outline-2"
            aria-label={`${s.label}: ${s.value}`}
          >
            <div className="text-2xl font-semibold" data-stat-value>
              {s.value}
            </div>
            <div className="opacity-70 text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
