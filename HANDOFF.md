# 3rd Meridian Website — Handoff

## Current status

This folder contains the first private website pass for 3rd Meridian. It is a responsive, single-page static site designed to be reviewed and refined before Relay launches.

This document is the working handoff for future edits. It records the company context, public messaging, product boundaries, UX direction, and launch decisions that should survive a move into Codex or another development environment.

Files:

- `index.html` — page structure, copy, navigation, Relay mockup, download choices, contact form
- `styles.css` — Apple-inspired visual system and responsive layout
- `script.js` — temporary placeholder-link behavior and mailto contact form behavior

## Product and messaging decisions

- Public company framing: 3rd Meridian helps engineers spend less time coordinating information and more time building what matters.
- Public product: Relay, an open-source MCP server that is free for public use.
- Relay audience: everyone involved in engineering, with engineers first and managers also included.
- AI clients: ChatGPT, Claude, and self-hosted/local AI.
- Founder names are intentionally omitted for now. Do not add Jishnu, Chris, or Varun until explicitly approved.
- NEXUS is intentionally omitted from the public website.
- Relay is still under construction and is expected to launch alongside the website in roughly two days.
- Visual direction: Apple-inspired, spacious, precise, high-contrast, with the existing 3rd Meridian crosshair logo and restrained blue accents.
- Homepage scope: mission, Relay, how it works, download/install choices, and contact. Keep it as one scrolling page for now.
- A product tutorial video will be added after Relay is complete.

## Company context

3rd Meridian is an engineering technology company. Its central belief is that engineers should spend their scarce cognitive capacity solving engineering problems, rather than coordinating information across fragmented tools and stakeholders.

The company is interested in the connective layer around engineering work: how information becomes context, how context supports a decision, and how a decision becomes an action. Existing tools such as CAD, email, messaging, documents, wikis, and file systems remain valuable; the problem is the coordination between them.

The public company story should stay human and concrete. It should speak to engineers first, while remaining legible to team leads, managers, and future engineering executives. The company page should communicate the mission without exposing internal enterprise strategy, unreleased products, founder names, or confidential customer discussions.

## Public versus internal boundaries

Public now:

- The 3rd Meridian mission and engineering focus
- Relay as the first public product
- Relay’s open-source and free-to-use positioning
- Supported AI entry points: ChatGPT, Claude, and self-hosted/local AI through GitHub
- The high-level workflow: connect context, ask naturally, understand relevant change, review next steps
- Human control and explainability

Keep private until explicitly approved:

- Founder and team names (Jishnu, Chris, and Varun)
- NEXUS and the internal product vision connecting Relay to a future enterprise platform
- Customer, partner, investor, and distribution discussions
- Unverified launch claims, unsupported integrations, architecture details, and security specifics
- Company LinkedIn and X profiles (now linked in the public footer)

## Relay claims grounded in the PRD

Relay can connect to existing engineering context, identify relevant changes, trace direct dependencies, produce a structured change brief, ask for approval before consequential actions, and handle post-edit documentation and communication. The engineer remains responsible for the actual engineering judgment and CAD edit.

The public copy should avoid promising integrations that are not live. The PRD lists Fusion 360 as the first concrete CAD connector and Gmail, Slack, Teams, documents, file systems, and minimal Relay state as the launch integration path. Confirm the actual launch matrix before publishing final claims.

## UX and design principles

The supplied UX document is an internal design reference, not public website copy. Its principles should guide the experience:

- Natural language is the primary interface. People state intent instead of learning a new modeling system.
- The system should reduce mental overhead and hide plumbing, setup, and bookkeeping where possible.
- Progressive disclosure: show the useful answer first, with deeper evidence and detail available when needed.
- Make provenance visible. Users should be able to understand where an important fact or recommendation came from.
- Explain actions before they happen, especially when they affect engineering work or other people.
- Preserve human judgment and explicit approval for consequential actions.
- Let relationships and dependencies emerge from actual work instead of asking users to maintain graphs manually.
- Prefer clear, calm, precise language over hype, dense dashboards, or unexplained technical vocabulary.
- Use hierarchy and whitespace to make complexity feel manageable.

For this first website, translate those principles into a calm Apple-inspired presentation: generous spacing, strong typography, a small number of clear actions, restrained motion, visible status, and a product example that explains itself. Do not add a dashboard, login flow, system graph, or design-principles manifesto to the public page unless requested.

## Source references

The complete product requirements are in `C:\Users\jishn\Downloads\Relay MCP PRD .md`.

The broader internal UX and NEXUS design doctrine is in `C:\Users\jishn\Downloads\UX Splatpages.md`. That document contains much more detail than belongs on the launch page; use it as a design and product reference, while honoring the public/private boundary above.

The prior company strategy discussion is in the Codex task titled `RDE firm plans`.

## Placeholders to replace before launch

The ChatGPT, Claude, and Self-hosted buttons currently show a temporary “coming at launch” message. Replace each `href="#launch-note"` on the three download cards in `index.html` with the real ChatGPT Marketplace, Claude Marketplace, and GitHub repository URL when available. Remove both `data-placeholder` and `aria-disabled` from each activated card so the placeholder handler no longer intercepts it, and update its coming-soon text. Relay is distributed through those three channels; there are no separate Windows, macOS, or Linux downloads on this page.

The contact form currently opens the visitor’s email application using `mailto:bluengineeringservices@gmail.com`. If a hosted form endpoint is selected later, replace the form handling in `script.js` and update the small explanatory note below the form.

Company LinkedIn and X links are now live in the footer. Add Reddit only if and when that account is ready.

Add a Relay product tutorial video section after the tutorial is recorded and hosted.

## Launch checklist

1. Confirm the final Relay launch integrations.
2. Add the ChatGPT Marketplace, Claude Marketplace, and GitHub repository links.
3. Test every install button on desktop and mobile.
4. Decide whether the private review phase needs a password/access gate.
5. Add the social links and any approved legal/privacy pages.
6. Buy and connect the preferred domain.
7. Replace the mailto form with a reliable hosted form if needed.
8. Review the final copy for claims that depend on Relay being live.
9. Add the tutorial video when available.
10. Publish only after the links and launch status are accurate.

## Brand notes

Keep the existing logo motif: circular crosshair with a four-point center. The site currently uses a light, spacious interface with black typography, soft gray surfaces, and blue interaction accents. Avoid adding founder biographies or internal product architecture to the public page.


## Refinement pass — September 16, 2026

- Preserved the mission-first single-page layout, existing brand motif, and public/private boundaries.
- Adjusted hero layering, narrow-screen spacing, input sizing, focus indicators, and reduced-motion support; added a skip link.
- Labeled the Relay mockup as illustrative and replaced its inactive button with an expandable example brief. The example is illustrative copy, not a verified product output.
- Replaced modal placeholder alerts with inline accessible status messages and marked download links as unavailable.
- Updated launch copy to reflect that Relay is still in development.
- Renamed the contact action to “Open email draft,” added autocomplete, a direct email fallback, and a status message. Actual delivery still depends on the visitor's email application; no message has been sent during testing.
- Replaced the private-review noindex directive with index/follow plus GitHub Pages canonical and social metadata for the public review site. Replace the canonical and social URL values when a final custom domain is connected. Never include this internal HANDOFF.md in public deployment assets.
- Local preview: run `python -m http.server 8765 --bind 127.0.0.1` in this folder and visit http://127.0.0.1:8765. No hosting or publication has been performed.
- Verification: JavaScript syntax check, public-file privacy and fragment checks, browser review at phone (375px), intermediate, and desktop (1440px) widths; expanded the sample brief and exercised all three placeholder links.
- Still pending: supplied marketplace/repository URLs, recorded tutorial, confirmed launch integrations, and explicit publication request.
- Follow-up refinement: marketplace cards now use platform-specific visual marks via CSS; a three-card “See Relay in action” video-ready section has been added. Replace each placeholder panel with a hosted muted video when tutorials are recorded. The contact form now uses `CONTACT_ENDPOINT` in `script.js`; set this to a hosted form endpoint (for example Formspree or a small serverless function) to receive submissions directly, then remove the temporary fallback copy.
- September 17 product narrative pass: added a sticky, scroll-synced Relay walkthrough stage with four explanatory steps and a single video-ready screen, plus two synthetic engineering workflow case studies grounded in the current playbook. The older three-card video placeholder section remains hidden for now. Hosting recommendation for this static site is Cloudflare Pages Free with a purchased domain; direct form delivery can use Formspree’s free tier initially (50 submissions/month, 30-day history). SEO groundwork now includes Organization structured data and social profile links; keep `noindex,nofollow` until the site is approved for launch, then add a trusted canonical domain, sitemap, Search Console, and launch content updates.
- September 17 case-study pass: replaced the short case-study treatment with an expandable library covering a final-drive gear, a compact cooling plate, a robot wrist bracket, and a cross-tool CAD/communication change workflow. Each follows problem framing, requirements, architecture, component design, materials/process, analysis, verification, change impact, approval, and documentation. The page labels all examples as synthetic and avoids customer, certification, or live-integration claims.
- Submission backend preparation: added `backend/worker.js`, `backend/schema.sql`, `backend/wrangler.toml.example`, and `backend/SETUP.md` for a Cloudflare Worker + D1 store. The website form now targets `CONTACT_ENDPOINT` and reports that submissions will be stored securely; no email delivery is used. Manual Cloudflare login, D1 creation, secret setup, deployment, and endpoint insertion remain required.
