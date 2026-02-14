"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getStagingPlayerBase } from "@/lib/api";

interface StoryPlayerOverlayProps {
  slug: string;
  c: string;
  story: number;
  onClose: () => void;
}

/** Build the oono staging player URL (single-encoded: # -> %23). Used for iframe and sharing. */
export function buildStagingPlayerUrl(slug: string, c: string, story: number): string {
  const base = getStagingPlayerBase().replace(/\/$/, "");
  const params = new URLSearchParams();
  params.set("c", c);
  params.set("story", String(story));
  return `${base}/${slug}?${params.toString()}`;
}

export function StoryPlayerOverlay({ slug, c, story, onClose }: StoryPlayerOverlayProps) {
  const router = useRouter();
  const pathname = usePathname();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentStoryRef = useRef(story);
  currentStoryRef.current = story;

  const iframeSrc = buildStagingPlayerUrl(slug, c, story);

  const updateLocalUrl = (newStory: number) => {
    currentStoryRef.current = newStory;
    const params = new URLSearchParams();
    params.set("c", c);
    params.set("story", String(newStory));
    router.replace(`${pathname ?? ""}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      const cur = currentStoryRef.current;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        updateLocalUrl(cur + 1);
        iframeRef.current?.setAttribute("src", buildStagingPlayerUrl(slug, c, cur + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (cur > 1) {
          updateLocalUrl(cur - 1);
          iframeRef.current?.setAttribute("src", buildStagingPlayerUrl(slug, c, cur - 1));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, c, pathname, router, slug]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Story player"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 left-4 z-[60] w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        aria-label="Close"
      >
        <span className="text-2xl leading-none" aria-hidden>×</span>
      </button>
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        title="Story player"
        className="w-full max-w-[360px] h-full max-h-[600px] mx-auto border-0 bg-black"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
