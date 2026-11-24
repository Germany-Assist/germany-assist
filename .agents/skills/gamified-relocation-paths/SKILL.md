---
name: gamified-relocation-paths
description: Build, extend, verify, or fix the gamified relocation paths for Germany Assist customers — profession + nationality + goal aware step plans, XP, levels, badges, and accuracy checks. Use when adding a profession, country rule, path step, badge, or any copy that makes a legal/administrative claim.
---

# Gamified relocation paths

Germany Assist gives every customer a relocation path that matches three things:

1. **Profession** — what they do (software engineer, nurse, doctor, engineer,
   teacher, accountant, chef, electrician, or other).
2. **Nationality / passport** — because document authentication and APS rules
   differ by country, and visa applications are made at the German mission
   responsible for the applicant's country of residence.
3. **Goal** — work with a job offer, arrive first and look for work
   (Chancenkarte), study, or start vocational training (Ausbildung).

The path is a checklist, not a promise. It awards XP, levels, and badges for
real progress, links every claim to an official source, and never claims an
approval, a cost, or a processing time that the platform cannot verify.

## Non-negotiables

- **Accuracy beats engagement.** A shorter honest path is better than a
  complete-looking path with one invented fact. XP must never encourage a user
  to pay for a step before an official source confirms it is needed.
- **Official sources only.** Every step has at least one `sourceId` resolved
  from `client/src/features/paths/data/sources.js`. The primary authority is
  **Make it in Germany, the Federal Government portal:
  <https://www.make-it-in-germany.com/de/>**. Check the German portal even when
  the customer reads English; it is the canonical version.
- **No volatile number without a claim.** Salaries, points, durations, fees,
  and blocked-account amounts live in `data/claims.js` with an
  `effectiveFrom`, an `effectiveTo` (or `null`), a source, and a fallback.
  Never type `€50,700` or `6 points` directly into a step description.
- **Never say** "guaranteed", "instant approval", "100%", "approved for you",
  or imply that buying a service decides a visa. Reject these words in path copy.
- **Identity honesty.** A path is a planning aid. The page must say it is not
  legal advice and that the competent authority or German mission makes the
  final decision.
- **Device-local progress for now.** XP and completed steps are stored in
  `localStorage` under `ga:path:v1:<userId|guest>:<pathId>`. The profession and
  relocation goal are persisted on `UserProfile`. Server-side progress sync is
  an explicit follow-up, not an implicit claim.

## Where the feature lives

```
client/src/features/paths/
  data/sources.js        official links + review dates
  data/claims.js         volatile facts with effective windows
  data/professions.js    profession rules and recognition guidance
  data/countries.js      APS, apostille, and legalisation rules
  data/goals.js          work / jobseeker / study / vocational
  pathEngine.js          buildPath(), validation, source resolution
  gamification.js        XP, levels, badges, streaks
  pathProgress.js        localStorage progress helpers (ga:path:v1)
  components/            PathSpotlight, PathPicker, PathStep, PathProgressPanel
  components/icons.js    icon map used by the picker and steps
```

Current state on `main`: the module is **not wired into the app yet** — there is
no `/paths` route, no navigation/footer link, no signup step and no home
spotlight. Wire the feature in the same commit as the UI that first uses it.

Planned integration points (do not assume they already exist):

- **Public home** — render `PathSpotlight` inside the existing service-discovery
  section, not as a fourth guest-home section (see `site-design`).
- **Navigation** — add a `Paths` link to `components/ui/NavigationBar.jsx` and
  `FooterSection.jsx` only when the routes exist.
- **Signup** — a path-onboarding step for individual (client) signups, storing
  the selection on `UserProfile`.
- **Signed-in area** — a "Your relocation path" panel in the dashboard.
- **Service catalog** — each step can carry a `serviceCategory`; the detail
  page links to `/services?category=<slug>` so a customer can buy help for that
  step without searching.

## The data model

`buildPath({ professionId, countryCode, goal })` returns:

```js
{
  id, profession, country, goal, title, subtitle, summary,
  totalXp, steps, phases, claims, sources,
  lastReviewed, reviewCadenceDays, disclaimer
}
```

A step:

```js
{
  id, order, phase, title, body,
  documents: string[], sourceIds: string[], claimIds: string[],
  xp: number, optional: boolean, tags: string[], serviceCategory: string
}
```

Phases are fixed and ordered: `prepare` → `apply` → `arrive` → `settle`.
Step ids are stable and unique within a path; progress keys rely on that.

### Adding a profession

1. Add an entry to `PROFESSIONS` with a stable `id`, label, icon key, summary,
   `regulated`, `recognition` (`required` / `recommended` / `optional`),
   `recognitionBody`, `languageNote`, `category`, and key documents.
2. Say whether it is a shortage occupation and Blue-Card-eligible. Do not
   duplicate the salary numbers — reference the claim ids.
3. Add the icon to `components/icons.js`.
4. Add an accuracy test once a runner exists (there is no eval suite on `main`
   yet — see Evals).
5. Run `npm run lint --prefix client` and `npm run build --prefix client`.

### Adding a country rule

1. Add the ISO-3166 alpha-2 code to `COUNTRIES`.
2. Set `aps` when the country has an Akademische Prüfstelle (currently India,
   China, Vietnam) and link the official APS source.
3. Set `authentication` to `apostille`, `legalisation`, or `check`. When
   unsure, use `check` and point to the HCCH Apostille status table. Never guess
   that a country issues apostilles.
4. Add the scenario to the accuracy checks/tests once a runner exists.

### Adding a goal

Goals change the middle of the path (`apply` phase). A goal must define a
label, description, and a builder that returns steps with official sources.
Never remove the universal steps: Quick-Check, documents, recognition/language,
arrival, Anmeldung, residence permit, admin setup, and starting life.

## Gamification rules

- XP comes from completed steps, not from a stored total. Re-completing a step
  never awards XP twice; unchecking removes exactly its XP.
- Levels are percentage-based so every path can reach the top:
  Newcomer 0%, Explorer 20%, Navigator 45%, Settler 70%, Local 100%.
- Badges are derived, not stored:
  - **First move** — one step complete.
  - **Documents ready** — every step tagged `documents` complete.
  - **Application in** — the visa application step complete. This means
    "submitted by the customer", not "approved".
  - **Landed** — arrival prep and Anmeldung complete.
  - **Settled** — every step complete.
- Streak = consecutive calendar days with at least one completion, counting
  back from today or yesterday. A broken streak resets to the current run.
- The UI must show the level, XP earned / total, a progress bar with
  `role="progressbar"`, and the next badge. It must not show a fake leaderboard
  or compare customers.

## Accuracy workflow (required before shipping copy)

1. Open **<https://www.make-it-in-germany.com/de/>**.
2. Use the **Quick-Check** for the route: arbeiten, studieren, Ausbildung,
   gründen, forschen.
3. Open the matching page:
   - Visa types: `/de/visum-anerkennung/visaarten`
   - Applying: `/de/visum-anerkennung/visum-beantragen`
   - Chancenkarte: `/de/visum-anerkennung/chancenkarte`
   - Recognition: `/de/visum-anerkennung/anerkennung`
   - First steps: `/de/ankommen-bleiben/erste-schritte`
   - Studying: `/de/studium-ausbildung/studieren-in-deutschland`
   - Ausbildung: `/de/studium-ausbildung/ausbildung-in-deutschland`
   - Job search: `/de/arbeiten-in-deutschland/jobsuche-bewerbung`
4. Cross-check the specific profession with the recognition portal
   <https://www.anerkennung-in-deutschland.de/> and the competent body
   (ZAB, state health authority, Approbation authority, Handwerkskammer, IHK,
   state education authority).
5. For document authentication, check the HCCH Apostille status table:
   <https://www.hcch.net/en/instruments/conventions/status-table/?cid=41>.
6. For visa logistics, check the German mission responsible for the customer's
   country of residence via <https://www.auswaertiges-amt.de/de>.
7. Update `sources.js` `verifiedOn` and `claims.js` windows and values in the
   same commit. If the current date is outside a claim's window, the UI must
   show the fallback wording, not the old number.
8. Run `npm run lint --prefix client` and `npm run build --prefix client`
   (there is no eval/test runner on `main` yet).

Re-verify on every quarter, and immediately when a new year starts (salary
thresholds and blocked-account amounts are usually updated on 1 January).

## Evals

There is no eval suite or test runner on `main` yet: `client/package.json` has
no `test` or `eval:paths` script, and the paths module has no `__tests__/`
folder. Until one is added, review the matrix by hand and run
`npm run lint --prefix client` + `npm run build --prefix client`.

When adding the suite, it must check:

- Golden profession + country + goal scenarios (India/software, Philippines/
  nurse, Turkey/doctor, Nigeria/student, Brazil/chef looking for work,
  Egypt/electrician vocational).
- APS is present only for APS countries; apostille/legalisation is present for
  the others.
- Regulated professions include recognition, language, and the correct visa
  route; non-regulated professions do not pretend recognition is mandatory.
- Study paths include admission, proof of funds, and a student visa; work paths
  include a job offer and a work visa; job-seeker paths include the
  Chancenkarte and proof of funds; vocational paths include a training place.
- Every step has a title, body, positive XP, and at least one real source.
- Every claim has an effective window, a source, a verified date, and a
  fallback. Expired claims resolve to the fallback.
- No unsourced numeric claims, guarantees, or approval promises in path copy.
- The full profession × country × goal matrix builds without duplicate step ids.
- Progress math never double-awards XP, levels are monotonic, badges are
  derived correctly, and streaks count consecutive days.

Treat a failing accuracy check as a content bug, not a test to relax. If a rule
genuinely changed, update the source, the claim window, the copy, and the check
together.

## UX review

- One `<h1>` per page. Paths index and path detail both have a single primary
  action; the homepage spotlight CTA is secondary so the hero stays primary.
- At 320px the picker stacks, the path title wraps, and the progress bar and
  step buttons remain reachable. Tables are not used here.
- Every select has a visible label. Step toggles are real buttons with
  `aria-expanded`; completion is a labelled checkbox, not a colour-only state.
- Every async or one-shot message is inline. There is no toast for path
  progress.
- Official links open in a new tab with `rel="noopener noreferrer"` and an
  accessible name that includes the source publisher.
- The disclaimer and "last reviewed" date are visible on the detail page, not
  buried in a modal.

## Common mistakes

- Hard-coding a salary threshold in a step body. Use a claim.
- Treating "recognised" as a binary for every profession. Doctors need
  Approbation, nurses need recognition as a Pflegefachkraft, teachers need
  state-specific recognition, and IT specialists may have a non-degree route.
- Saying APS is required for every non-EU country. It is not.
- Saying an apostille is always enough. Some documents still need consular
  legalisation or certified translation.
- Showing "Visa approved" when the customer ticked "application submitted".
- Letting a marketing CTA promise a job, a visa, or a timeline.
- Adding a fourth guest-home section. Put path marketing inside the existing
  discovery section, or one level deeper on `/paths`.
