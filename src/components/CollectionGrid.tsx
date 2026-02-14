"use client";

import Link from "next/link";
import { buildCollectionParam, getAssetUrl } from "@/lib/api";
import type { Collection, Topic } from "@/lib/types";
import { TopicFilter } from "./TopicFilter";

const USE_AMP_PLAYER =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_USE_AMP_PLAYER === "true";

interface CollectionGridProps {
  slug: string;
  collections: Collection[];
  topics?: Topic[];
  selectedTopicId?: string | null;
  showStoryHighlights?: boolean;
}

function CollectionCard({
  col,
  slug,
  topicParam,
}: {
  col: Collection;
  slug: string;
  topicParam?: string;
}) {
  const c = buildCollectionParam(col);
  const params = new URLSearchParams();
  params.set("c", c);
  params.set("story", "1");
  if (topicParam) params.set("topic", topicParam);
  const href = USE_AMP_PLAYER
    ? `/api/amp-story/${slug}?${params.toString()}`
    : `/${slug}?${params.toString()}`;
  const thumbUrl = getAssetUrl(col.thumbnail || col.cover);
  const title = col.name.length > 50 ? col.name.slice(0, 47) + "…" : col.name;
  return (
    <Link
      key={col._id}
      href={href}
      className="block rounded-xl overflow-hidden border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-[9/16] relative bg-gray-200">
        <img
          src={thumbUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <p className="p-3 text-sm text-gray-900 font-medium line-clamp-2">
        {title}
      </p>
    </Link>
  );
}

export function CollectionGrid({
  slug,
  collections,
  topics = [],
  selectedTopicId = null,
  showStoryHighlights = true,
}: CollectionGridProps) {
  const displayed =
    selectedTopicId != null
      ? (() => {
          const topic = topics.find((t) => t._id === selectedTopicId);
          if (!topic?.collections?.length) return collections;
          const ids = new Set(
            topic.collections.map((ref) => ref.collectionId ?? ref._id)
          );
          return collections.filter(
            (c) => ids.has(c.collectionId) || ids.has(c._id)
          );
        })()
      : collections;
  const highlights = showStoryHighlights ? displayed.slice(0, 5) : [];
  const topicParam = selectedTopicId ?? undefined;
  const selectedTopic = selectedTopicId
    ? topics.find((t) => t._id === selectedTopicId)
    : null;

  return (
    <section className="w-full">
      {highlights.length > 0 && (
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {highlights.map((col) => {
            const c = buildCollectionParam(col);
            const thumbUrl = getAssetUrl(col.thumbnail || col.cover);
            const title = col.name.length > 20 ? col.name.slice(0, 17) + "…" : col.name;
            const params = new URLSearchParams();
            params.set("c", c);
            params.set("story", "1");
            if (selectedTopicId) params.set("topic", selectedTopicId);
            const linkHref = USE_AMP_PLAYER
              ? `/api/amp-story/${slug}?${params.toString()}`
              : `/${slug}?${params.toString()}`;
            return (
              <Link
                key={col._id}
                href={linkHref}
                className="shrink-0 flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-black transition-colors shadow-sm">
                  <img
                    src={thumbUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs font-medium text-gray-900 text-center max-w-[5rem] truncate">
                  {title}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      <div className="border-t border-black pt-4 mt-2 mb-4 flex justify-center sm:justify-start">
        <h2 className="text-lg font-bold text-gray-900 inline-block pb-2 border-b-2 border-black">
          Stories
        </h2>
      </div>

      {topics.length > 0 && (
        <>
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
            <TopicFilter slug={slug} topics={topics} selectedTopicId={selectedTopicId} />
          </div>
          {selectedTopic?.description && (
            <p className="text-gray-500 text-sm mt-2 mb-4 text-center sm:text-left">
              {selectedTopic.description}
            </p>
          )}
        </>
      )}

      {!displayed.length ? (
        <p className="text-gray-500 text-sm py-8 text-center">No collections in this topic.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mt-4 w-full">
          {displayed.map((col) => (
            <CollectionCard key={col._id} col={col} slug={slug} topicParam={topicParam} />
          ))}
        </div>
      )}
    </section>
  );
}
