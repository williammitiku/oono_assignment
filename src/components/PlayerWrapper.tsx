"use client";

import { useRouter } from "next/navigation";
import { StoryPlayerOverlay } from "./StoryPlayerOverlay";

interface PlayerWrapperProps {
  slug: string;
  c: string;
  story: number;
}

export function PlayerWrapper({ slug, c, story }: PlayerWrapperProps) {
  const router = useRouter();

  const onClose = () => {
    // Close video and go back to home
    router.replace("/", { scroll: false });
  };

  return (
    <StoryPlayerOverlay slug={slug} c={c} story={story} onClose={onClose} />
  );
}
