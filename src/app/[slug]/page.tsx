import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { fetchCollections, fetchTopics } from "@/lib/api";
import { CollectionGrid } from "@/components/CollectionGrid";
import { PlayerWrapper } from "@/components/PlayerWrapper";
import { QRCodeBlock } from "@/components/QRCodeBlock";
import type { Topic } from "@/lib/types";

const USE_AMP_PLAYER =
  process.env.NEXT_PUBLIC_USE_AMP_PLAYER === "true";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ c?: string; story?: string; topic?: string }>;
}

export default async function BrandCollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { c, story, topic: topicParam } = await searchParams;
  const storyNum = story ? Math.max(1, parseInt(story, 10) || 1) : 0;
  const showPlayer = Boolean(c && storyNum >= 1);
  const selectedTopicId = topicParam && topicParam.trim() !== "" ? topicParam.trim() : null;

  if (USE_AMP_PLAYER && showPlayer && c) {
    redirect(`/api/amp-story/${slug}?${new URLSearchParams({ c, story: String(storyNum) }).toString()}#showStoryUrlInfo=0`);
  }

  let collections: Awaited<ReturnType<typeof fetchCollections>>["data"] = [];
  let topics: Topic[] = [];
  let error: string | null = null;

  try {
    const res = await fetchCollections(slug, selectedTopicId ?? undefined);
    if (res.success && res.data) collections = res.data;

    const brandId = collections[0]?.brand;
        if (brandId) {
          try {
            const topicsRes = await fetchTopics(brandId);
            if (topicsRes.data && Array.isArray(topicsRes.data)) topics = topicsRes.data;
          } catch {
            // Topics optional; continue without filters
          }
        }
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load collections";
  }

  const titleLabel = slug.replace(/-/g, " ");
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const pageUrl = `${protocol}://${host}/${slug}`;

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 px-4 py-4 flex justify-center">
        <a href="/" className="text-xl font-semibold text-black no-underline">
          William
        </a>
      </header>
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-500 shrink-0 flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
              {titleLabel}
            </h1>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">
              cwdv dwvsdvawvdwwwavwwwwwrv uhwfo uqwhfou qwehfouwqeh fu
            </p>
          </div>
        </div>
        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}
        <CollectionGrid
          slug={slug}
          collections={collections}
          topics={topics}
          selectedTopicId={selectedTopicId}
        />
      </div>
      <footer className="border-t border-gray-200 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-2">
    
            <span className="font-semibold text-gray-900"></span>
          </span>
          <QRCodeBlock url={pageUrl} size={128} />
        </div>
      </footer>
      {showPlayer && c && !USE_AMP_PLAYER && (
        <PlayerWrapper slug={slug} c={c} story={storyNum} />
      )}
    </main>
  );
}
