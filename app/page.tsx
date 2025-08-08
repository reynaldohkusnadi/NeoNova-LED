import { content } from "@/content/site";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-semibold text-center">{content.headline}</h1>
      <p className="max-w-prose text-center text-balance opacity-80">
        {content.blurbShort}
      </p>
    </main>
  );
}
