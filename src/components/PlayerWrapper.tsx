"use client";

import { useRouter, usePathname } from "next/navigation";
import { StoryPlayerOverlay } from "./StoryPlayerOverlay";

interface PlayerWrapperProps {
  slug: string;
  c: string;
  story: number;
}

export function PlayerWrapper({ slug, c, story }: PlayerWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();

  const onClose = () => {
    router.replace(pathname ?? "/", { scroll: false });
  };

  return (
    <StoryPlayerOverlay slug={slug} c={c} story={story} onClose={onClose} />
  );
}
