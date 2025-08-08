interface StaticHeroProps {
  headline: string;
  blurb: string;
}

export default function StaticHero({ headline, blurb }: StaticHeroProps) {
  return (
    <section className="w-full max-w-4xl mx-auto text-center py-16">
      <h2 className="text-3xl font-semibold mb-3">{headline}</h2>
      <p className="opacity-80">{blurb}</p>
    </section>
  );
}


