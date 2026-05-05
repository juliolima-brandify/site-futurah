import { notFound } from "next/navigation";

export default async function AnalisePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();
  return (
    <main className="min-h-screen px-6 py-16 bg-white text-neutral-900">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm uppercase tracking-widest text-neutral-500">Análise</p>
        <h1 className="mt-2 text-3xl font-semibold">{slug}</h1>
      </div>
    </main>
  );
}
