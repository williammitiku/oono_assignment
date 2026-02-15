"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { QRCodeBlock } from "./QRCodeBlock";

interface StoryPlayerOverlayProps {
  slug: string;
  c: string;
  story: number;
  onClose: () => void;
  pageUrl?: string;
}

/** AMP story endpoint (same origin). Deep-links to story index via ?story=N. embed=1 hides in-story close (overlay provides it). */
export function buildAmpStoryUrl(slug: string, c: string, story: number): string {
  const params = new URLSearchParams();
  params.set("c", c);
  params.set("story", String(story));
  params.set("embed", "1");
  return `/api/amp-story/${slug}?${params.toString()}`;
}

export function StoryPlayerOverlay({ slug, c, story, onClose, pageUrl }: StoryPlayerOverlayProps) {
  const router = useRouter();
  const pathname = usePathname();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentStoryRef = useRef(story);
  currentStoryRef.current = story;

  const iframeSrc = buildAmpStoryUrl(slug, c, story);

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
        iframeRef.current?.setAttribute("src", buildAmpStoryUrl(slug, c, cur + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (cur > 1) {
          updateLocalUrl(cur - 1);
          iframeRef.current?.setAttribute("src", buildAmpStoryUrl(slug, c, cur - 1));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, c, pathname, router, slug]);

  const collectionUrl = pageUrl ?? (typeof window !== "undefined" ? `${window.location.origin}/${slug}` : "");

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-gray-800 via-gray-700 to-red-800/90"
      role="dialog"
      aria-modal="true"
      aria-label="Story player"
      data-player="amp"
    >
      {/* Backdrop: clicking here closes and keeps you on our app (not oono’s site) */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 z-[55] cursor-pointer"
        aria-label="Close overlay"
      />
      <div className="relative z-[60] flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 pointer-events-none">
        <span className="text-xl font-semibold text-white tracking-tight">#</span>
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          aria-label="Close"
        >
          <span className="text-2xl leading-none font-light" aria-hidden>×</span>
        </button>
      </div>
      <div className="relative z-[58] flex-1 min-h-0 flex flex-col items-center justify-center px-2 py-2 sm:px-4">
        <div className="relative w-full max-w-[380px] sm:max-w-[420px] flex-1 max-h-[85vh] sm:max-h-[720px] flex flex-col">
          <button
            type="button"
            onClick={onClose}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-[62] w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors shrink-0 pointer-events-auto sm:left-2"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-h-0 w-full bg-white rounded-[2rem] sm:rounded-[2.5rem] p-1 sm:p-1.5 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-black">
              <iframe
                ref={iframeRef}
                src={iframeSrc}
                title="Story player"
                className="w-full h-full border-0 bg-black pointer-events-auto"
                allow="autoplay; fullscreen"
                data-player="amp"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-[60] flex items-end justify-between px-4 py-3 sm:px-6 sm:py-4 pointer-events-none">
        <a
          href="https://oono.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto rounded-lg bg-red-900/90 px-3 py-2 text-sm font-medium text-white hover:bg-red-900 transition-colors"
        >
          Made with #
        </a>
        {collectionUrl ? (
          <div className="flex flex-col items-end">
            <QRCodeBlock url={collectionUrl} size={100} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
