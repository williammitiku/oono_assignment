"use client";

import { useRouter } from "next/navigation";
import { StoryPlayerOverlay } from "./StoryPlayerOverlay";

interface PlayerWrapperProps {
  slug: string;
  c: string;
  story: number;
  pageUrl?: string;
}

export function PlayerWrapper({ slug, c, story, pageUrl }: PlayerWrapperProps) {
  const router = useRouter();

  const onClose = () => {
    router.replace(`/${slug}`, { scroll: false });
  };

  return (
    <StoryPlayerOverlay slug={slug} c={c} story={story} onClose={onClose} pageUrl={pageUrl} />
  );
}
