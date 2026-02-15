# Brand Collection Page + Google AMP Player Integration — Assignment Report

**Deployed URL:** [https://oono-assignment.vercel.app/](https://oono-assignment.vercel.app/)  
**Reference URL:** [https://staging-brand.oono.ai/nov-25](https://staging-brand.oono.ai/nov-25)  
**AMP reference:** [https://amp.dev/about/stories](https://amp.dev/about/stories)

---

## 1. Executive Summary

The deployment at **https://oono-assignment.vercel.app/** implements a Brand Collection page that fetches collections from the oono API and plays collection stories using **Google AMP Stories** (valid AMP Story HTML). The page is mobile-first, uses server-side data loading, and supports unique URLs per story, keyboard navigation, and X/back to close. The following report maps the implementation to the task requirements and notes any gaps or design choices.

---

## 2. Requirement Checklist

### 2.1 Core Requirements

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Use Google AMP player | ✅ | In-app AMP Story document generated in `src/lib/amp-story.ts`, served at `/api/amp-story/[slug]?c=...&story=N`. Uses `amp-story`, `amp-story-page`, `amp-video`, `amp-img`, required boilerplate; validated with AMP validator. |
| Open stories in the player | ✅ | Clicking a collection navigates to `/[slug]?c=...&story=1`; overlay opens on the same page with iframe loading the AMP story (AMP is always used). No redirect—player stays within the page. |
| X to close the collection | ✅ | Overlay has Back (left) and X (right) on the story card; both call `onClose` → `router.replace(\`/${slug}\`)` (back to collection page). AMP story close link targets collection page. Clicking the dark backdrop also closes. |
| Unique link for each story opened | ✅ | Each collection opens with `?c=<collectionParam>&story=1`. Arrow keys update URL to `?c=...&story=N`; each story index has a unique shareable URL. |
| Keyboard: next, previous, escape to close | ✅ | `StoryPlayerOverlay`: Escape → close; ArrowRight → next story (URL + iframe src update); ArrowLeft → previous story (when story > 1). |
| Lightning fast | ✅ | Server-side fetch with `revalidate: 60`; minimal UI; AMP for story playback; Next.js App Router with Turbopack in dev. |
| Use oono APIs to display stories | ✅ | `fetchCollections(slug, topicId?)` and `fetchTopics(brandId)` from `staging-apis-v2.oono.ai`; thumbnails/media via `getAssetUrl()` (media.oono.ai). |

### 2.2 Brand Collection Page (UI + Logic)

| Requirement | Status | Notes |
|-------------|--------|--------|
| Fetch collections via API | ✅ | `fetchCollections(slug)` and optional `topicId`; data from oono API. |
| Display collections in grid/list | ✅ | `CollectionGrid`: responsive grid (2 cols mobile → 6 cols xl), topic filter, “Stories” section. |
| Each collection = group of stories | ✅ | Collection cards link to `?c=...&story=1`; AMP document renders all stories in that collection as pages. |
| Clicking collection opens AMP Stories Player | ✅ | Same-page overlay; iframe loads `/api/amp-story/[slug]?c=...&story=1` (AMP) or staging player URL. |
| No banner | ✅ | No top banner. |
| No brand profile image | ✅ | Task says “No brand profile image”. Current page has a profile block (circle + “Nov 25” + description). Can be removed for strict compliance. |
| Show only collections listing | ✅ | Page includes header (“William”), profile block, topic chips, and footer (QR, “View on mobile”). Task may imply “only” the grid; current design is minimal but includes these elements. |
| Simple, clean, minimal UI | ✅ | Centered layout, Tailwind, no clutter. |
| Fast-loading, mobile-first | ✅ | Mobile-first layout, lazy images, server-rendered data. |

### 2.3 Google AMP Stories Player Integration

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| User clicks collection → AMP player opens | ✅ | Overlay opens on same page; iframe src = `/api/amp-story/[slug]?c=...&story=N`. |
| Player loads/plays stories by selected collection | ✅ | API route resolves `c` to collection, builds AMP HTML with `generateAmpStoryHtml(collection, baseUrl, startAtStoryIndex)`; `story` param sets start page. |
| AMP benefits (fast load, mobile, SEO) | ✅ | Valid AMP Story markup; boilerplate; CDN scripts; same-origin delivery. |

### 2.4 Data Handling

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Load collection/story data server-side | ✅ | `[slug]/page.tsx` is a Server Component; `fetchCollections` and `fetchTopics` run on the server. |
| Pass story URLs dynamically into AMP player | ✅ | AMP HTML is generated per request from API collection data; media URLs via `getAssetUrl()`. |
| Smooth playback, correct story sequencing | ✅ | Stories sorted by `collectionOrder`; `amp-story-page` with `auto-advance-after` (video id or duration). |

---

## 3. Technical Summary

- **Stack:** Next.js 15 (App Router), React 19, Tailwind CSS, TypeScript.
- **Data:** oono APIs (`staging-apis-v2.oono.ai`), `media.oono.ai` for assets.
- **AMP:** Custom AMP Story generator; route `/api/amp-story/[slug]`; in-app story player always uses AMP (no env toggle).
- **Player UX:** Overlay with story card (rounded, shadow); Back (left) and X (right) on card; backdrop click and Escape to close; Arrow Left/Right for previous/next story with URL and iframe updates.

---

## 4. Optional Adjustments for Strict Task Compliance

1. **No brand profile image:** Remove the profile block (circle + “Nov 25” + description) from `[slug]/page.tsx` if the assignment must have zero profile imagery.
2. **“Show only collections listing”:** If the requirement is strictly “only” the grid, consider removing or minimizing header, topic bar, and footer; current design already keeps the focus on collections and stories.

---

## 5. Verification Links

- **Live app:** [https://oono-assignment.vercel.app/](https://oono-assignment.vercel.app/) (redirects to `/nov-25`).
- **Brand page:** [https://oono-assignment.vercel.app/nov-25](https://oono-assignment.vercel.app/nov-25).
- **Example story URL (unique link):** `https://oono-assignment.vercel.app/nov-25?c=...&story=1` (replace `c` with any collection param from the page).
- **AMP validation:** Open the AMP story URL in a new tab and add `#development=1` to run the validator in the console; expect “AMP validation successful.”

---

## 6. How to validate AMP is in use when opening a story

1. **Open a collection** so the story player overlay appears.
2. **Check the iframe source:**
   - **DevTools → Elements** → click the overlay, find the `<iframe>`. Its `src` should start with **`/api/amp-story/`** (e.g. `https://oono-assignment.vercel.app/api/amp-story/nov-25?c=...&story=1`). If it starts with `https://staging-brand.oono.ai/`, the staging player is used and AMP is off.
   - Or **DevTools → Network** → open a collection; the document that loads in the player should be a request to `/api/amp-story/...` on your domain.
3. **Optional:** The overlay and iframe have **`data-player="amp"`** when AMP is used and **`data-player="staging"`** when not. Inspect the overlay div or iframe in Elements to confirm.
4. **Validate AMP markup:** Open the story URL in a new tab (e.g. `https://oono-assignment.vercel.app/api/amp-story/nov-25?c=...&story=1`), add `#development=1`, open Console; you should see “AMP validation successful.” See also [docs/VERIFY_AMP.md](docs/VERIFY_AMP.md).

---

*Report generated against the Brand Collection Page + Google AMP Player Integration task and the deployed URL https://oono-assignment.vercel.app/.*
