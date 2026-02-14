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

const USE_AMP_PLAYER =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_USE_AMP_PLAYER === "true";

/** Our AMP story endpoint (same origin). Deep-links to story index via ?story=N. */
export function buildAmpStoryUrl(slug: string, c: string, story: number): string {
  const params = new URLSearchParams();
  params.set("c", c);
  params.set("story", String(story));
  return `/api/amp-story/${slug}?${params.toString()}`;
}

/** Build the oono staging player URL (single-encoded: # -> %23). Used when AMP is disabled. */
export function buildStagingPlayerUrl(slug: string, c: string, story: number): string {
  const base = getStagingPlayerBase().replace(/\/$/, "");
  const params = new URLSearchParams();
  params.set("c", c);
  params.set("story", String(story));
  return `${base}/${slug}?${params.toString()}`;
}

function buildPlayerUrl(slug: string, c: string, story: number): string {
  return USE_AMP_PLAYER ? buildAmpStoryUrl(slug, c, story) : buildStagingPlayerUrl(slug, c, story);
}

/** Iframe src. No #development=1 here so AMP dev tools don't run in iframe (they expect amp-story-player parent and cause "page-1"/isAd errors). Validate by opening the AMP URL in a new tab with #development=1. */
function getIframeSrc(slug: string, c: string, story: number): string {
  return buildPlayerUrl(slug, c, story);
}

export function StoryPlayerOverlay({ slug, c, story, onClose }: StoryPlayerOverlayProps) {
  const router = useRouter();
  const pathname = usePathname();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentStoryRef = useRef(story);
  currentStoryRef.current = story;

  const iframeSrc = getIframeSrc(slug, c, story);

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
        iframeRef.current?.setAttribute("src", getIframeSrc(slug, c, cur + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (cur > 1) {
          updateLocalUrl(cur - 1);
          iframeRef.current?.setAttribute("src", getIframeSrc(slug, c, cur - 1));
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
      data-player={USE_AMP_PLAYER ? "amp" : "staging"}
    >
      {/* Backdrop: clicking here closes and keeps you on our app (not oono’s site) */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 z-[55] cursor-pointer"
        aria-label="Close overlay"
      />
      {/* Story card: back/X sit on the story (in-story UI like reference) */}
      <div className="relative z-[58] w-full max-w-[360px] h-full max-h-[600px] flex items-center justify-center mx-auto rounded-2xl overflow-hidden shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-3 top-3 z-[60] w-11 h-11 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer shrink-0"
          aria-label="Back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-[60] w-11 h-11 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer shrink-0"
          aria-label="Close"
        >
          <span className="text-[1.6rem] leading-none font-light" aria-hidden>×</span>
        </button>
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          title="Story player"
          className="w-full h-full border-0 bg-black pointer-events-auto rounded-2xl"
          allow="autoplay; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          data-player={USE_AMP_PLAYER ? "amp" : "staging"}
        />
      </div>
    </div>
  );
}
