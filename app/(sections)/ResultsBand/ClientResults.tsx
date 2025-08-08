"use client";

import type { Stat } from "@/content/site";

interface ClientResultsProps {
  stats: [Stat, Stat];
}

export default function ClientResults({ stats }: ClientResultsProps) {
  return (
    <section className="w-full max-w-3xl mx-auto grid grid-cols-2 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border p-4 text-center">
          <div className="text-2xl font-semibold">{s.value}</div>
          <div className="opacity-70 text-sm">{s.label}</div>
        </div>
      ))}
    </section>
  );
}


