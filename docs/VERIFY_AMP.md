# Verifying AMP Story output

The in-app story player can use **AMP Story** (when `NEXT_PUBLIC_USE_AMP_PLAYER=true`). The document is generated in `src/lib/amp-story.ts` and served at `/api/amp-story/[slug]?c=...&story=...`.

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

1. Set `NEXT_PUBLIC_USE_AMP_PLAYER=true` in `.env.local`.
2. Open the AMP story URL in a **new tab** and add `#development=1`, e.g.:
   ```
   http://localhost:3000/api/amp-story/nov-25?c=...&story=1#development=1
   ```
3. Open **Developer Tools → Console**. If the document is valid AMP, you should see: **"AMP validation successful."**

## 3. Official validator

For a public URL, use [validator.ampproject.org](https://validator.ampproject.org/) and enter the full AMP story URL. For localhost, paste the HTML (e.g. from View Source on the AMP URL) into the validator.
