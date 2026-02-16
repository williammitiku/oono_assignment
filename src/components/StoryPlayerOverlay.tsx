"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { QRCodeBlock } from "./QRCodeBlock";

interface StoryPlayerOverlayProps {
  slug: string;
  c: string;
  story: number;
  onClose: () => void;
  pageUrl?: string;
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
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
  const [shareFeedback, setShareFeedback] = useState(false);

  const iframeSrc = buildAmpStoryUrl(slug, c, story);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = "Story";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard?.writeText(url);
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 2000);
      }
    } catch {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 2000);
      }
    }
  };

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
      className="fixed inset-0 z-50 flex flex-col bg-black sm:bg-gradient-to-b sm:from-gray-800 sm:via-gray-700 sm:to-red-800/90"
      role="dialog"
      aria-modal="true"
      aria-label="Story player"
      data-player="amp"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 z-[55] cursor-pointer"
        aria-label="Close overlay"
      />
      <div className="hidden sm:flex relative z-[60] items-center justify-between px-4 py-3 sm:px-6 sm:py-4 pointer-events-none">
        <span className="text-xl font-semibold text-white tracking-tight"></span>
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={handleShare}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            aria-label="Share story"
            title="Share this story"
          >
            <ShareIcon className="w-5 h-5" />
            {shareFeedback && (
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white bg-black/70 px-2 py-1 rounded whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            aria-label="Close"
          >
            <span className="text-2xl leading-none font-light" aria-hidden>×</span>
          </button>
        </div>
      </div>
      <div className="absolute inset-0 sm:relative sm:z-[58] sm:flex-1 sm:min-h-0 flex flex-col items-stretch justify-center sm:items-center sm:px-4 z-[58]">
        <div className="relative w-full h-full min-h-0 flex-1 sm:h-auto sm:flex-none sm:max-w-[420px] sm:max-h-[720px] flex flex-col">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-2 sm:-left-2 top-1/2 -translate-y-1/2 z-[62] w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors shrink-0 pointer-events-auto"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-h-0 w-full bg-black sm:bg-white sm:rounded-[2.5rem] p-0 sm:p-1.5 sm:shadow-2xl flex flex-col overflow-hidden relative">
            <div className="flex-1 min-h-0 sm:rounded-[2rem] overflow-hidden bg-black relative">
              <div className="sm:hidden absolute top-3 left-3 z-[62] flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={handleShare}
                  className="relative w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  aria-label="Share story"
                  title="Share this story"
                >
                  <ShareIcon className="w-5 h-5" />
                  {shareFeedback && (
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white bg-black/70 px-2 py-1 rounded whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  aria-label="Close"
                >
                  <span className="text-2xl leading-none font-light" aria-hidden>×</span>
                </button>
              </div>
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
      <div className="hidden sm:flex relative z-[60] items-end justify-between px-4 py-3 sm:px-6 sm:py-4 pointer-events-none">
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
