import type { Collection, StoryItem } from "./types";
import { getAssetUrl } from "./api";

/** Optional 0-based index to start the story at (for deep-linking). Optional closeUrl is the X button target (e.g. collection page). */
export function generateAmpStoryHtml(
  collection: Collection,
  baseUrl: string,
  startAtStoryIndex: number = 0,
  closeUrl?: string
): string {
  const posterSrc = getAssetUrl(collection.thumbnail || collection.cover);
  const title = collection.name.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const sorted = (collection.stories || []).sort(
    (a, b) => (a.collectionOrder?.[collection.collectionId] ?? 0) - (b.collectionOrder?.[collection.collectionId] ?? 0)
  );
  const fromIndex = Math.max(0, Math.min(startAtStoryIndex, sorted.length));
  const storiesToRender = sorted.slice(fromIndex);
  const pages = storiesToRender.map((story, i) => renderStoryPage(story, i, closeUrl));
  return `<!DOCTYPE html>
<html ⚡ lang="en">
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
  <script async custom-element="amp-video" src="https://cdn.ampproject.org/v0/amp-video-0.1.js"></script>
  <title>${title}</title>
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <link rel="canonical" href="${baseUrl}">
  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
  <noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
</head>
<body>
  <amp-story
    standalone
    title="${title}"
    publisher="oono"
    publisher-logo-src="${posterSrc}"
    poster-portrait-src="${posterSrc}"
    poster-square-src="${posterSrc}"
  >
${pages.join("\n")}
  </amp-story>
</body>
</html>`;
}

function renderStoryPage(story: StoryItem, index: number, closeUrl?: string): string {
  const pageId = `page-${index}`;
  const isVideo = story.backgroundType === "VIDEO";
  const isImage = story.backgroundType === "IMAGE" || story.backgroundType === "EMBED";
  const mediaUrl = getAssetUrl(story.background);
  const posterUrl = getAssetUrl(story.thumbnail || story.coverImage || story.background);
  const duration = story.duration && story.duration > 0 ? story.duration : 15;

  let mediaTag: string;
  if (isVideo) {
    mediaTag = `<amp-video id="vid-${index}" layout="fill" src="${escapeHtml(mediaUrl)}" poster="${escapeHtml(posterUrl)}" muted autoplay width="720" height="1280"><source type="video/mp4" src="${escapeHtml(mediaUrl)}"></amp-video>`;
  } else {
    mediaTag = `<amp-img layout="fill" src="${escapeHtml(mediaUrl)}" alt=""></amp-img>`;
  }

  const autoAdvance = isVideo ? ` auto-advance-after="vid-${index}"` : ` auto-advance-after="${duration}s"`;
  const outlink =
    closeUrl != null
      ? `
      <amp-story-page-outlink layout="nodisplay" cta-image="data:image/svg+xml,${encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><line x1="8" y1="8" x2="24" y2="24"/><line x1="24" y1="8" x2="8" y2="24"/></svg>'
      )}">
        <a href="${escapeHtml(closeUrl)}" title="Close">×</a>
      </amp-story-page-outlink>`
      : "";
  return `    <amp-story-page id="${pageId}"${autoAdvance}>
      <amp-story-grid-layer template="fill">
        ${mediaTag}
      </amp-story-grid-layer>${outlink}
    </amp-story-page>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
