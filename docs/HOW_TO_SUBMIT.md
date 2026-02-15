# How to Report / Submit the Assignment

Use this as a guide when handing in the **Brand Collection Page + Google AMP Player Integration** task.

---

## This submission

| Item | Value |
|------|--------|
| **Live URL** | https://oono-assignment.vercel.app/ |
| **Collection page** | https://oono-assignment.vercel.app/nov-25 |
| **Source code** | https://github.com/williammitiku/oono_assignment |

---

## 1. What to submit

Usually you’ll need to send:

1. **Live URL** – A working link reviewers can open in a browser.
2. **Source code** – GitHub repo link **or** a zip of the project.
3. **Short report** – A document that says what you built and how it meets the requirements.

---

## 2. Get a live URL (deploy)

If you don’t have a deployed link yet:

### Option A: Vercel (recommended for Next.js)

1. Push your project to GitHub.
2. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
3. **Add New Project** → import your repo.
4. Set **Environment Variables** (same as `.env.local`):
   - `NEXT_PUBLIC_OONO_API_BASE`
   - `OONO_APP_TOKEN`
   - `NEXT_PUBLIC_OONO_ASSET_BASE` (optional)
5. Deploy. Vercel will give you a URL like `https://your-project.vercel.app`.

### Option B: Other hosts

- **Netlify:** Connect the repo and use the Next.js build settings.
- **Railway / Render / etc.:** Use their Next.js guides and add the same env vars.

After deployment, your **collection page** will be something like:
`https://your-app.vercel.app/nov-25`

---

## 3. What to put in the report

You already have two docs in the repo:

- **`docs/ASSIGNMENT_CHECKLIST.md`** – Requirement-by-requirement checklist (all ✅).
- **`docs/ASSIGNMENT_REPORT.md`** – Longer report with technical details.

You can:

- **Submit the checklist** as the main “requirements met” proof, and/or  
- **Use the report** as the full write-up (update the “Deployed URL” at the top to your real link).

Before submitting, **replace the placeholder deployed URL** in `ASSIGNMENT_REPORT.md` with your actual live URL (e.g. your Vercel link).

---

## 4. One-page submission template (copy-paste)

You can paste something like this into an email or submission form:

```
Subject: Assignment submission – Brand Collection Page + Google AMP Player

---

Assignment: Brand Collection Page + Google AMP Player Integration
Reference: https://staging-brand.oono.ai/nov-25

LIVE DEMO:
https://oono-assignment.vercel.app/nov-25

SOURCE CODE:
https://github.com/williammitiku/oono_assignment

REQUIREMENTS COVERED:
• Brand Collection page: collections from API, grid layout, no banner, no brand profile, minimal UI, mobile-first
• Google AMP Stories Player: stories open in-player on the same page (overlay)
• X to close collection; unique URL per story (?c=...&story=N); keyboard: next / previous / Escape to close
• Server-side data loading; story URLs passed dynamically into AMP; correct story order
• oono APIs used for collections and media

VERIFICATION:
1. Open the live URL → see collections.
2. Click a collection → story player opens in overlay (phone-style frame).
3. Use Escape to close; Arrow Right/Left for next/previous; URL updates per story.
4. AMP: story is served from /api/amp-story/... (valid AMP Story).

Full requirement checklist and technical report are in the repo under docs/ASSIGNMENT_CHECKLIST.md and docs/ASSIGNMENT_REPORT.md.
```

---

## 5. Checklist before you submit

- [ ] App is deployed and the live URL opens correctly.
- [ ] `/nov-25` (or your slug) shows the collections grid.
- [ ] Clicking a collection opens the story player (overlay with phone frame).
- [ ] Close (X), keyboard (Escape, arrows), and unique story URLs work.
- [ ] `ASSIGNMENT_REPORT.md` (if you send it) has the **correct deployed URL** at the top.
- [ ] Repo or zip includes `docs/` (so they can open ASSIGNMENT_CHECKLIST.md and ASSIGNMENT_REPORT.md).

---

If the assignment form has a specific format (e.g. “paste link here”, “upload PDF”), use the same content as above and adapt the layout to that format.
