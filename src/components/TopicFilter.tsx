"use client";

import Link from "next/link";
import type { Topic } from "@/lib/types";

interface TopicFilterProps {
  slug: string;
  topics: Topic[];
  selectedTopicId: string | null;
}

export function TopicFilter({ slug, topics, selectedTopicId }: TopicFilterProps) {
  const basePath = `/${slug}`;
  const isAllSelected = selectedTopicId === null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide items-center">
      <Link
        href={basePath}
        className={`shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isAllSelected
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
        }`}
      >
        All
      </Link>
      {topics.map((topic) => {
        const isSelected = selectedTopicId === topic._id;
        const href = `${basePath}?topic=${encodeURIComponent(topic._id)}`;
        return (
          <Link
            key={topic._id}
            href={href}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isSelected
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            {topic.image && (
              <span className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 shrink-0 block">
                <img
                  src={topic.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </span>
            )}
            {topic.name}
          </Link>
        );
      })}
    </div>
  );
}
