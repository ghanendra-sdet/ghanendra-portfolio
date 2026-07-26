# Learning Log — Portfolio Red Flags & Fixes

> Local-only tracker (not meant to be linked from the live site). Findings from the 2026-07-26
> red-flag audit of this repo, kept here so they can be worked through one at a time instead of
> all at once. Update status as each item is actually fixed — don't just check boxes from memory.

## How to use this file

- [ ] = not started · [~] = in progress · [x] = fixed and verified live
- Work top to bottom — Critical items make the site actively misleading or broken; fix those
  before anyone new is sent the link.

---

## 🔴 Critical — fix before sharing the link with anyone

- [ ] **Site isn't actually live.** `Ghanendra-Portfolio` repo is private, and GitHub Pages isn't
      enabled (confirmed via API — 404). Either make the repo public and enable Pages, or set up
      a different host — but right now the portfolio URL doesn't resolve for anyone.
- [ ] **Contact form is fake.** `script.js` — `initContactForm()` is explicitly commented
      "Visual Only." It shows a fake "message sent successfully" confirmation but never actually
      sends anything anywhere. A real visitor filling it out believes they reached you and won't.
      This is a static site (GitHub Pages, no backend) — the form has to hand off to a third-party
      service to actually deliver anywhere. Options, decided 2026-07-27, easiest first:

      1. **Formspree (recommended)** — least setup. Create a free account at formspree.io, create
         one form, get an endpoint URL (`https://formspree.io/f/xxxxxxx`). Point the `<form>`'s
         `action` at it, add `name` attributes to each input, submit via `fetch()` so the existing
         "Message Sent!" animation only shows after Formspree actually confirms. Free tier: 50
         submissions/month, no secrets exposed, no deploy step, works from GitHub Pages as-is.
      2. **EmailJS** — a bit more setup, more control over the email's format. Free account at
         emailjs.com, connect a real mailbox (Gmail/Outlook) via OAuth, build an email template,
         get a Public Key + Service ID + Template ID, add the EmailJS script + a few lines of JS.
         Free tier: 200 emails/month. Same GitHub Pages compatibility, no backend.
      3. **A real backend function** (Cloudflare Worker / Vercel Function + an email API like
         Resend) — most control and most secure (no third party ever sees the message), but real
         engineering: a cloud account, deploying a function, CORS setup, a server-side API key.
         Only worth it if you want to own the whole pipeline — overkill for a portfolio form.
      4. **Plain `mailto:` link** — zero setup, works today as a stopgap. Not really "a form" —
         clicking Send opens the visitor's own email client pre-filled with their message. Less
         polished and depends on them having an email client configured, but it's honest in the
         meantime rather than showing a fake success state.

      Decision: start with Formspree (~5 min of account setup on Ghanendra's end, code side done
      by Claude) — and do it around the same time as actually deploying the site, since a working
      form on a site nobody can reach doesn't help much (see the "site isn't live" item above).
- [ ] **"View on GitHub" 404s on every Paywize case study.** `Playwright-Starter-Framework` repo
      is private but linked from the Automation page and all 7 Paywize project heroes as if
      public. Either make that repo public (review it for anything sensitive first) or remove/
      relabel the links until it is.
- [ ] **Testimonials are fabricated and credited to real employers.** No real names anywhere —
      just role initials ("PM", "TL", "AI", "EM") — but each quote is attributed to "Paywize
      Technologies" or "Sixaxis Technology" by name. An invented quote credited to a real company
      is a real risk if anyone there ever sees it, not just a content-quality issue. Needs a
      decision: get real permission-based quotes, rewrite as your own self-assessment instead of
      a third-party quote, or remove the section entirely until real testimonials exist.

## 🟠 High — visible sloppiness, fix soon

- [ ] **22 unfilled `[Add Duration]` / `[Add Team Size]` placeholders** across all 11 project
      pages — literally rendering as bracketed TODO text on live-looking pages. Needs real dates/
      team sizes supplied, or the chips redesigned to not show a bracket-placeholder at all if
      the data isn't ready.
- [ ] **No favicon.** Browser tab shows a generic/blank icon. Quick fix, high visibility.

## 🟡 Judgment calls — reconsider, not necessarily wrong

*(all three resolved 2026-07-26 — see Resolved section below)*

---

## ⚠️ New finding from the resume check (2026-07-26) — needs a decision

Read the actual PDF text. Two real structural mismatches between the resume and the site, not
just wording:

1. **The resume lists only 2 Paywize projects, not 7.** It bundles everything into "PROJECT #1:
   Connected Banking & BBPS – FintechOS" (Mar 2026 – Present) and "PROJECT #2: Payout & Collection
   Engine" (Aug 2025 – Mar 2026) — sequential, not concurrent. The site now presents Collection,
   Payout, Connected Banking, BBPS, **Reseller, AI Dispute Resolution Engine, and YOBO** as 7
   separate named case studies. Reseller and YOBO aren't mentioned anywhere on the resume, even as
   sub-bullets — only AI Dispute has a resume trace (a sub-section under Project #1, not a named
   project). A recruiter who reads both back to back will notice the site describes products the
   resume never names.
2. **The resume never uses "QA Lead" as a title** — title throughout is "Software Test Engineer."
   It does support a mentoring claim ("Mentored QA team members, reviewed test artifacts...") but
   has no "5+ team members" figure anywhere — that specific number on the site isn't backed by the
   resume.
3. Everything else checked out consistent: real company/client names, contact info, the ~78.5 TPS
   / 1.6M+ txn / 57-service figures, the 300+/350+/200+/150+/100+ defect counts per employer, and
   the Sixaxis "Star Performer / Employee of the Month" award all match what's already on the site.

**This needs your call, not a silent fix** — either (a) update the resume to name all 7 Paywize
products explicitly, (b) fold the site's 7 case studies back under the resume's 2 umbrella
projects with a note on how they relate, or (c) leave both as-is and accept a recruiter might ask
about the gap in an interview. I didn't touch the PDF or the site's project structure — flagging
only.

---

## Notes

- This file intentionally lives outside the published site (not linked from `index.html` or any
  project page) — it's a working list for you and future sessions, not visitor-facing content.
- When an item is fixed, move a one-line summary to a "Resolved" section below with the date,
  rather than deleting the row — keeps a record of what was actually checked vs. assumed.

## Resolved

- **2026-07-26 — Complexity badges reframed.** Changed every "Complexity: High/Medium/Medium-High"
  hero chip across all 11 project pages to a fact-based "Core Risk: <specific risk>" label instead
  (e.g. "Core Risk: Ledger Correctness", "Core Risk: Consent Revocation") — no more self-grading.
  Also reworded the accompanying lede sentence from "Why this rates High complexity:" to "The
  hardest part of testing this:", same reasoning kept, just not framed as a self-assessment.
- **2026-07-26 — Phone number removed from public HTML.** Contact section's Phone card no longer
  renders the raw number or a `tel:` link — replaced with "Available on request — message via the
  form or email above." Removed the phone icon from the footer socials entirely (kept email +
  LinkedIn). No JS depended on the old `tel:` elements, confirmed via grep before removing.
- **2026-07-26 — Resume vs. site checked.** See the "New finding" section above — real structural
  gap found (7 site case studies vs. 2 resume-listed Paywize projects, no "QA Lead" title or "5+
  team members" figure on the resume). Reported, not silently resolved — needs your decision on
  which document to reconcile toward.
