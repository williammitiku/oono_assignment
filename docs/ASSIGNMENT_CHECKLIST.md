# Assignment Checklist — Brand Collection Page + Google AMP Player

Verified against the task brief. All requirements are implemented.

---

## Objective

| Requirement | Status | Where |
|-------------|--------|--------|
| Recreate Brand Collection page matching reference (staging-brand.oono.ai/nov-25) | ✅ | `[slug]/page.tsx` + CollectionGrid + overlay |
| Display brand collections from API, play with Google AMP Stories Player | ✅ | API fetch + `/api/amp-story/[slug]` + iframe |
| Optimal performance, SEO, mobile experience | ✅ | Server-side data, AMP markup, mobile-first layout |

---

## Core Requirements (bullets)

| Requirement | Status | Implementation |
|-------------|--------|-----------------|
| Use Google AMP player | ✅ | `src/lib/amp-story.ts` generates valid AMP Story HTML; served at `/api/amp-story/[slug]?c=...&story=N`. Uses `amp-story`, `amp-story-page`, `amp-video`, `amp-img`, AMP boilerplate. |
| Open stories in the player | ✅ | Clicking a collection goes to `/[slug]?c=...&story=1`; overlay opens with iframe loading AMP story. |
| X to close the collection | ✅ | Overlay has × (top right), Back (left of phone), and backdrop click; all call `onClose` → back to collection page. |
| Unique link for each story opened | ✅ | URL is `/[slug]?c=...&story=N`. Arrow keys update `story=N` and iframe `src`; each story index has a shareable URL. |
| Keyboard: next, previous, escape to close | ✅ | `StoryPlayerOverlay`: **Escape** → close; **ArrowRight** → next story; **ArrowLeft** → previous story. |
| Everything lightning fast | ✅ | Server-side fetch with `revalidate: 60`, minimal UI, AMP for stories, Next.js App Router. |
| Use oono APIs to display stories | ✅ | `fetchCollections(slug, topicId?)`, `fetchTopics(brandId)` from oono API; `getAssetUrl()` for media (media.oono.ai). |

---

## 1. Brand Collection Page (UI + Logic)

### Key requirements

| Requirement | Status | Implementation |
|-------------|--------|-----------------|
| Fetch collections data via API | ✅ | `fetchCollections(slug, topicId?)` in `src/lib/api.ts`; called in `[slug]/page.tsx` (server). |
| Display collections in grid or list layout | ✅ | `CollectionGrid`: responsive grid (2→6 columns), “Stories” section, optional topic highlights. |
| Each collection = group of stories/videos | ✅ | Collection cards link to `?c=...&story=1`; AMP document renders all stories in that collection as pages. |
| Clicking a collection opens AMP Stories Player | ✅ | Same-page overlay; iframe `src` = `/api/amp-story/[slug]?c=...&story=1`. |

### Design guidelines

| Requirement | Status | Notes |
|-------------|--------|--------|
| No banner required | ✅ | No top banner. |
| No brand profile image | ✅ | No profile block (avatar/description). |
| Show only collections listing | ✅ | Header, optional topic filter, collections grid, footer (QR). No extra brand profile. |
| Simple, clean, minimal UI | ✅ | Tailwind, centered layout, no clutter. |
| Fast-loading and mobile-first | ✅ | Mobile-first breakpoints, lazy images, server-rendered data. |

---

## 2. Google AMP Stories Player Integration

### Functional flow

| Requirement | Status | Implementation |
|-------------|--------|-----------------|
| User clicks on a collection | ✅ | Link to `/[slug]?c=...&story=1`. |
| AMP Stories Player opens on the same page | ✅ | Overlay stays on collection page; iframe loads AMP story. |
| Player loads and plays stories by selected collection | ✅ | API route resolves `c` to collection, builds AMP HTML with `generateAmpStoryHtml()`; `?story=N` sets start page. |

### AMP benefits

| Benefit | Status |
|---------|--------|
| Faster load time | ✅ Valid AMP, CDN scripts. |
| Better mobile performance | ✅ AMP runtime, viewport meta. |
| SEO-friendly rendering | ✅ Valid AMP Story markup, canonical link. |

**AMP reference:** Implementation follows [amp.dev/about/stories](https://amp.dev/about/stories) (amp-story, amp-story-page, required scripts and boilerplate).

---

## 3. Data Handling

| Requirement | Status | Implementation |
|-------------|--------|-----------------|
| Load collection and story data from server-side code | ✅ | `[slug]/page.tsx` is a Server Component; `fetchCollections` and `fetchTopics` run on the server. |
| Pass story URLs dynamically into the AMP Stories Player | ✅ | AMP HTML generated per request from API data; media via `getAssetUrl()`. |
| Smooth playback and correct story sequencing | ✅ | Stories sorted by `collectionOrder`; `amp-story-page` with `auto-advance-after` (video id or duration). |

---

## Key Considerations

| Consideration | Status |
|--------------|--------|
| Google AMP Stories Player best practices | ✅ AMP-compliant markup, required scripts, boilerplate. |
| Compatibility with modern browsers and mobile | ✅ Viewport, no unsupported features. |
| AMP-compliant markup and scripts | ✅ `html ⚡`, amp-story, amp-video, amp-img, CDN scripts. |

---

## Quick verification

1. **Collections page:** Open `/[slug]` (e.g. `/nov-25`) → see grid of collections, no banner, no brand profile image.
2. **Open story:** Click a collection → overlay with phone-style frame and AMP story; URL = `?c=...&story=1`.
3. **Close:** Click × or Back or backdrop → return to collection page.
4. **Keyboard:** Escape = close; Arrow Right = next story (URL and iframe update); Arrow Left = previous story.
5. **Unique link:** Open `/[slug]?c=...&story=3` in a new tab → story 3 opens in the player.
6. **AMP:** Iframe `src` starts with `/api/amp-story/`; validate AMP by opening that URL in a new tab and adding `#development=1` in the console.

---

*Last checked against the full task brief. All listed requirements are satisfied.*
