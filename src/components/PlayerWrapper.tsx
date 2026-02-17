"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface PlayerWrapperProps {
  slug: string;
  c: string;
  story: number;
  pageUrl?: string;
}

/** Build AMP story URL for direct navigation (without embed parameter). */
function buildAmpStoryUrl(slug: string, c: string, story: number): string {
  const params = new URLSearchParams();
  params.set("c", c);
  params.set("story", String(story));
  return `/api/amp-story/${slug}?${params.toString()}`;
}

export function PlayerWrapper({ slug, c, story }: PlayerWrapperProps) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to AMP Story page directly - AMP will handle the player natively
    const ampStoryUrl = buildAmpStoryUrl(slug, c, story);
    router.push(ampStoryUrl);
  }, [slug, c, story, router]);

  // Return null while redirecting
  return null;
}
