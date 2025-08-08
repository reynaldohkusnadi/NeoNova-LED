import { content } from "@/content/site";
// import StaticHero from "@/app/(sections)/Hero3D/StaticHero";
import ClientHero from "@/app/(sections)/Hero3D/ClientHero";
// import ClientCarousel from "@/app/(sections)/Carousel/ClientCarousel";
import CardCarousel from "@/app/(sections)/Carousel/CardCarousel";
import ProvenImpactAux from "@/app/(sections)/ProvenImpact/ProvenImpactAux";
// import ClientResults from "@/app/(sections)/ResultsBand/ClientResults";
import ResultsBand from "@/app/(sections)/ResultsBand/ResultsBand";
import { CarouselReveal } from "@/app/(sections)/Carousel/Carousel.client";
import { ResultsBandReveal } from "@/app/(sections)/ResultsBand/ResultsBand.client";
import SlideOverForm from "@/app/(sections)/Form/SlideOverForm";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-stretch gap-12 p-8">
      <ClientHero headline={content.headline} blurb={content.blurbShort} />
      <CardCarousel cards={content.cardsCore} />
      <CarouselReveal />
      <ResultsBand stats={content.stats} />
      <ResultsBandReveal />
      {/* Optional aux slot renders only when content.cardsAux?.[0] exists */}
      <ProvenImpactAux card={content.cardsAux?.[0]} mode="intro" />
      <SlideOverForm
        ctaPrimary={content.form.ctaPrimary}
        ctaSecondary={content.form.ctaSecondary}
      />
    </main>
  );
}
