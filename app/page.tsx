import { content } from "@/content/site";
import StaticHero from "@/app/(sections)/Hero3D/StaticHero";
// import ClientCarousel from "@/app/(sections)/Carousel/ClientCarousel";
import CardCarousel from "@/app/(sections)/Carousel/CardCarousel";
import ProvenImpactAux from "@/app/(sections)/ProvenImpact/ProvenImpactAux";
import ClientResults from "@/app/(sections)/ResultsBand/ClientResults";
import SlideOverForm from "@/app/(sections)/Form/SlideOverForm";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-stretch gap-12 p-8">
      <StaticHero headline={content.headline} blurb={content.blurbShort} />
      <CardCarousel cards={content.cardsCore} />
      <ClientResults stats={content.stats} />
      {/* Optional aux slot renders only when content.cardsAux?.[0] exists */}
      <ProvenImpactAux card={content.cardsAux?.[0]} mode="intro" />
      <SlideOverForm
        ctaPrimary={content.form.ctaPrimary}
        ctaSecondary={content.form.ctaSecondary}
      />
    </main>
  );
}
