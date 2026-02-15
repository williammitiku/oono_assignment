# Verifying AMP Story output

The in-app story player always uses **AMP Story**. The document is generated in `src/lib/amp-story.ts` and served at `/api/amp-story/[slug]?c=...&story=...`.

## 0. Confirm the story is opening through AMP

Use these checks to confirm that when you open a collection, the **AMP player** is used (not the oono staging iframe).

1. **Env**  
   AMP is always used for the story player.  
   - Local: set in `.env.local` and restart the dev server.  
   - Vercel: set in Project → Settings → Environment Variables for Production/Preview.

2. **Iframe URL (quickest)**  
   Open a collection so the story overlay appears, then:
   - **DevTools → Elements**: select the `<iframe>` inside the overlay. Check its `src`:
     - **AMP in use:** `src` starts with `/api/amp-story/` (e.g. `/api/amp-story/nov-25?c=...&story=1`).
     - **Staging in use:** `src` starts with `https://staging-brand.oono.ai/`.
   - Or **DevTools → Network**: reload after opening the story; the first request for the player should be to `/api/amp-story/...` (same origin) if AMP is on.

3. **Data attribute**  
   The overlay and iframe have `data-player="amp"` when AMP is used, and `data-player="staging"` when the staging player is used. In **Elements**, select the overlay div or the iframe and check the attribute.

4. **Same-origin**  
   If the story loads and the browser’s address bar stays on your domain (e.g. `oono-assignment.vercel.app`) and the iframe document is same-origin, you are serving the story yourself — i.e. via your AMP route.

If any check shows staging (or `data-player="staging"`), the app has been built from an older version; the current app always uses AMP.

## 1. Structure check (script)

With the dev server running, get a valid `c` from the app (open any collection and copy the `c` query param from the URL), then:

```bash
npm run verify:amp -- http://localhost:3000 nov-25 "YOUR_C_VALUE"
```

The script checks that the response includes:

- `<!DOCTYPE html>`
- `<html ⚡` or `amp`
- `lang` on `<html>`
- AMP runtime and `amp-story` script
- `<amp-story>` and `<amp-story-page>` elements

## 2. AMP validator in the browser

The overlay does **not** add `#development=1` to the iframe (doing so loads AMP dev tools in the iframe, which expect an `amp-story-player` parent and cause "page-1" / "isAd" console errors). To validate:

1. Open the AMP story URL in a **new tab** and add `#development=1`, e.g.:
   ```
   http://localhost:3000/api/amp-story/nov-25?c=...&story=1#development=1
   ```
2. Open **Developer Tools → Console**. If the document is valid AMP, you should see: **"AMP validation successful."**

## 3. Official validator

For a public URL, use [validator.ampproject.org](https://validator.ampproject.org/) and enter the full AMP story URL. For localhost, paste the HTML (e.g. from View Source on the AMP URL) into the validator.
