---
name: site-design
description: Load when designing, building, restyling, or extending any Germany Assist page or component — the public site, auth flows, service catalog, booking path, or role-aware dashboard. Covers layout, navigation, design tokens, page patterns, responsive behaviour, accessibility, and the UX review pass on the React 19 + Vite + Tailwind v3 stack.
---

# Designing Germany Assist

This is the design playbook for the product: a relocation and service
marketplace where people moving to Germany find verified specialists for visas,
housing, jobs, and the administrative steps around them.

It mirrors `client/tailwind.config.cjs` and `client/src/index.css`; when they
disagree, the live code wins and both the code and this file get corrected.

## Stack (fixed)

- **Monorepo:** `client/` (React 19 + Vite 8) and `server/` (Express,
  Sequelize/PostgreSQL, Redis, Socket.io, S3 via LocalStack). Docker Compose
  runs the infrastructure.
- **Routing:** React Router v7. Every route is declared in
  `client/src/config/routesConfig.js` with a `handle` label, optional role
  restrictions, and lazy-loaded page components. Role filtering happens in
  `client/src/utils/routeUtils.js`; `App.jsx` renders the filtered tree.
- **Styling:** Tailwind CSS v3. Tokens live in `client/tailwind.config.cjs`;
  global animations and the `@layer components` helpers live in
  `client/src/index.css`. There is no CSS-in-JS. Light is the default theme, but
  dark mode exists: `ThemeSwitch` toggles it and components pair `light-*`
  tokens with `dark:` variants — keep both themes in sync when editing.
- **Data:** all HTTP calls go through `client/src/api/*` (axios), never from a
  presentational component. Cross-page state lives in `client/src/contexts/`
  (`AuthContext`, `ProfileContext`, `MetadataContext`, `NotificationContext`,
  `SocketContext`).
- **UI libraries already installed:** `lucide-react` (primary icon set),
  `@heroicons/react` and `react-icons` (legacy), `framer-motion` (sparingly),
  `react-modal`, `react-toastify`, `react-select`, `chart.js`/`react-chartjs-2`,
  `@stripe/react-stripe-js`.
- **Commands (from repo root):**
  - `npm run dev` — server + client together.
  - `npm run build` — client production build (`vite build`).
  - `npm run lint --prefix client` — ESLint.
  - `npm run dbInit` — migrate and seed the database.
  - No test runner is configured on `main`; verify changes with lint + build.

## Design language

**"Calm relocation concierge."** White surfaces, slate ink, a single sky-blue
accent, soft gradients, hairline borders, and generous whitespace. It should
feel like a competent, friendly advisor handling paperwork — trustworthy and
legible, never a loud SaaS template, never neon, never a wall of cards with no
hierarchy.

- **Identity motifs (use sparingly — they make the product ours):**
  - The **relocation progress card** — a white card with a labelled checklist,
    a thin progress bar, and a quiet state pill ("In progress"). It appears in
    the hero and can be reused wherever progress is the point.
  - **Verification signals** — a check/`ShieldCheck` badge, "Verified
    specialist", approval-state pills. Only show a verification signal when
    the backend actually says the account is verified.
  - The **provider chip over imagery** on service cards (white/90 backdrop,
    uppercase micro-label) and the **price-range block** in the card footer.
  - **Status dots** — a 1.5px colored dot plus an uppercase label for order,
    dispute, verification, and finance states.
  - A short **sky-to-white background wash** behind hero and page headers; the
    rest of the page stays white.
  - **Trust strip / partner marquee** on the guest home only.
- **Shape:** `rounded-2xl` cards and panels, `rounded-xl` buttons and inputs,
  `rounded-full` for pills, avatars, and filter chips. Interaction is a 2px
  hover lift (`hover:-translate-y-0.5`) and a slightly deeper border/shadow;
  avoid hard offset shadows and claymorphism. On dark image overlays use
  `bg-white/90 backdrop-blur`.
- **Type:** **Plus Jakarta Sans** is the default (`font-sans` in
  `tailwind.config.cjs`); **Outfit** is the display/heading face used by auth
  and dashboard shells (`font-outfit` or `font-[Outfit,sans-serif]`).
  Headings are bold, tight (`tracking-tight`), slate-900. Body is regular with
  `leading-relaxed`, slate-600. Micro-labels are `text-[10px]`/`text-xs`,
  uppercase, `tracking-widest`, and used once per block — not on every line.
- **Colour:**
  - Primary action and links: **sky-700**, hover **sky-800**; active nav is
    `text-sky-800 bg-sky-100`; focus rings are sky-700 everywhere.
  - Page: white (`bg-light-950` = `#ffffff`); section wash `sky-50`; card
    surfaces white; borders `slate-200`/`light-700` (`#e2e8f0`); body text
    `slate-600`/`light-text` (`#1e293b`); headings `slate-900`; muted
    `slate-500`.
  - `accent` (#22d3ee cyan) is decoration only: a hover glow, a sparkle, a
    chart line. Never body text, never a primary button, never a large fill.
  - Semantic states: emerald = verified/approved/live/success, amber =
    pending/in-progress, blue = completed/info, red = rejected/refunded/error/
    destructive. `light-*` and the legacy `dark-*` scale both resolve to the
    light palette — there is no dark surface.
  - Gradients are reserved for one hero headline span and soft background
    washes, not for cards or buttons.
- **Layout:** public pages use `max-w-7xl mx-auto px-6` with `py-12 md:py-16`
  section rhythm; the guest hero is a two-column grid from `lg` with proof on
  the left and a product card on the right. Marketing sections stack to one
  column on phones. Auth uses a narrow left brand panel from `lg` and a form
  column. The dashboard uses a sticky 220px sidebar (56px collapsed), a top
  bar, and a `#f7f9ff` content canvas with `22px 24px 32px` padding.
- **Tone of copy:** plain, confident English for an international audience.
  Gloss German administrative terms on first use (Anmeldung, Blue Card,
  Sperrkonto) instead of assuming knowledge. Be precise about what is
  included, who does it, and how long it takes. No invented statistics,
  approval guarantees, response times, or review counts — if the number is not
  in the data, it does not ship.
- **One primary action per screen:** on the guest home that is "Explore
  services"; "Get started free" is the quiet secondary. On a service profile
  it is "Book" / "Request". On auth it is the submit button. Destructive
  actions (cancel, refund, delete, dispute) use red and never appear as the
  filled primary next to a neutral action.

## Design tokens (`client/tailwind.config.cjs`, `client/src/index.css`)

- `light-950` page white, `light-900` section wash, `light-800` raised surface,
  `light-700` border, `light-text` body ink. The `dark-*` names mirror the same
  light values for legacy components — using them does not create a dark UI.
- `accent` (#22d3ee) and `accent-soft` (#0a8ecc).
- Fonts: `font-sans` (Plus Jakarta Sans), `font-outfit` (Outfit).
- Motion: `animate-float`, `animate-shimmer`, `animate-marquee`,
  `animate-pulse-ring`, `animate-loading-bar`, plus the page-level
  `animate-fade-up`, `animate-fade-in`, `animate-slide-in-left`,
  `animate-alert-in`, `animate-count-up`, `animate-feat-in`, `animate-pop`,
  `animate-shake`, `stagger-1…8`, and `ease-elegant`. Respect
  `prefers-reduced-motion` (the global stylesheet already disables the named
  animations; use `motion-reduce:` for anything new).
- Component classes: `glass-card` (white/70, blur, hairline border, soft
  shadow), `accent-glow`, `btn-ripple`, `focus-glow`, `spinner`,
  `custom-scrollbar`, `no-scrollbar`.
- Use Tailwind's default sky/slate/emerald/amber/blue/red scales. Do not add a
  second accent. Do not put raw hex values in new components; the remaining
  `#024CEE`, `#0a0f1e`, and `rounded-[2.2rem]` values are migration debt from
  the older service-card/dashboard styling — converge on sky-700 and
  `rounded-2xl` instead of spreading them.

## UX rules (product-wide, non-negotiable)

1. **One primary action per screen.** A secondary CTA is an outline or a text
   link. Do not render "Sign up" and "Get started" and "Create account" as
   three filled buttons on the same view.
2. **Say it once.** Navigation belongs in `NavigationBar`; legal/company links
   belong in `FooterSection`; an explanation belongs on the page that owns the
   feature. Never repeat the same promise in the hero and again in a body
   section, and never print the nav links as a second chip row.
3. **Cap the guest home at three sections:** hero, trust strip, service
   discovery. A new home idea either replaces one of these or lives one level
   deeper (e.g. a category page). Signed-in users are routed to the dashboard
   (`/dashboard`), which has its own shell — do not stack the marketing hero on
   top of it.
4. **Every public destination is one decision away.** Home, Services, Jobs,
   About, Sign in, and Sign up are reachable from the header (and from the
   footer where appropriate). New top-level pages update `NavigationBar`,
   `FooterSection`, and `routesConfig.js` together — no orphans.
5. **Auth is a page, not a modal.** `/signin`, `/signup/individual`, and
   `/signup/provider` are the canonical entries; `/forgot-password` is a page
   too. Preserve role-aware redirects and the return path after sign-in. The
   nav shows "Log in / Sign up" when signed out and the avatar/notifications
   when signed in.
6. **Progressive disclosure for catalogs.** Services are searched and filtered
   before they are paginated (9 per page, debounced search, category and price
   filters, sort). Dashboards reveal detail through tabs and expandable rows,
   not by showing every panel at once. When a filter is active, say what is
   showing and how many matched.
7. **A card answers one question.** A service card answers "is this the right
   provider for my problem?" — image, provider, title, short description,
   rating, price range, and one action. Do not turn it into a finance table.
   Dashboard metric cards answer "how much / how many, and is that good?"
8. **No horizontal scroll at 320px.** `document.documentElement.scrollWidth`
   must not exceed the viewport. The global `overflow-x-hidden` on `body`
   hides bugs; find the widening element and fix it. Watch `whitespace-nowrap`
   / `truncate` inside flex rows, long emails and IDs, wide tables, and
   dashboard grids. Tables and icon rows may scroll only inside a
   `min-w-0 overflow-x-auto` wrapper.
9. **Target sizes:** buttons, icon buttons, and chips are at least 44px tall
   (`h-11`/`min-h-11`); standalone text links used as actions get
   `inline-flex items-center min-h-9`. Inline links inside a sentence are
   exempt. Keep the visible `focus-visible` outline on every interactive
   element (`outline-2 outline-offset-2 outline-sky-700`).
10. **Feedback in place.** Every async action renders its result where the
    action was: `role="status"` for progress/success, `role="alert"` for
    failure, and a disabled, relabelled button while pending ("Saving…",
    "Sending…"). Page-level confirmations may use `react-toastify`, but form
    errors belong next to the field. Confirmations name the email or record
    that changed.
11. **Empty states must earn their space.** One honest sentence plus the
    action that fills the space ("No services match these filters — clear
    filters"). Never render a decorative empty card when the page already says
    the same thing. Loading uses skeletons that match the final layout, not a
    full-page spinner on a content page.
12. **The mobile header stays learnable.** Below `lg` the nav is a sticky
    `h-16` white bar with a 44px menu button that has `aria-expanded`,
    `aria-controls`, and a changing `aria-label`. The account entry (avatar or
    Log in / Sign up) is always visible and never scrolls away. The open menu
    closes on link click, Escape, and outside interaction.
13. **Role-aware means honest.** Never show an action the current role cannot
    perform. Hide role tabs and route guards together. A client should not see
    "Manage timelines", and an unverified provider should see the verification
    step, not a working payout form. Empty admin panels say "No records yet",
    not a fake number.
14. **Money and status are literal.** Use EUR formatting with the data's real
    currency. Order, payment, dispute, and verification labels map to backend
    enum values; do not invent intermediate states. Never claim escrow,
    instant approval, or guaranteed timelines that the system does not
    implement.
15. **Accessibility floor:** one `<h1>` per page, a skip link on long pages,
    landmark elements (`header`/`nav`/`main`/`footer`), labelled form controls,
    `aria-hidden` on decorative icons, `aria-live` for dynamic counts,
    colour never as the only signal (pair status dots with text), and visible
    focus order that matches reading order.

## Navigation and product model

Keep this mental map; new features fit inside it rather than becoming a new
top-level tab.

**Public site**

- **Home** (`/`) — hero, trust strip, service discovery. The same public home
  is shown to signed-in users; the role-aware overview lives in `/dashboard`.
- **Services** (`/services`) — the catalog: search, category, price and rating
  filters, sort, three-column card grid, pagination, empty and skeleton states.
  Deep links use `?category=`.
- **Service profile** (`/service/:serviceId`) — provider, gallery, description,
  variants or timelines, reviews, and the booking sidebar. Role variants exist
  at `/admin/service/:id` and `/provider/service/:id`; keep them visually
  consistent with the public profile and show the role-specific controls only.
- **Jobs** (`/jobs`) — currently a `MaintenancePage` placeholder and labelled
  "Soon" in the nav. Keep that label until the feature is real; do not
  deep-link it from marketing copy.
- **About** (`/about`) — founders, values, contact CTA.
- **Auth** — `/signin`, `/signup`, `/signup/individual`, `/signup/provider`,
  `/forgot-password` (split-panel layout).
- **Footer** — Company (About, Services, Jobs), Legal (Terms, Privacy), social
  links. Add new legal/contact pages here, not in the header.

**Signed-in surfaces**

- `/dashboard` — the legacy role-aware dashboard shell with tabs per role:
  admin (users, services, orders, finance, providers, verification,
  notifications, profile), client (orders, favorites, profile, disputes,
  messages, notifications), provider (services, variants, timelines, finance,
  disputes, verification, notifications).
- `/updated-dashboard` — the newer service-provider shell (sidebar, topbar,
  grouped nav: Overview, Work, Finance, Account, Help). New provider dashboard
  work goes here; do not duplicate a feature across both shells.
- `/timeline/:timelineId` and `/provider/timeline/:id` — the order journey
  view for clients and providers.
- `/admin/service/:id` and `/provider/service/:id` — role-specific service
  management.

Rules for new pages:

1. Add the route to `client/src/config/routesConfig.js` with a `handle` label
   and `roles` when it is not public. Wire lazy loading and `Suspense` the same
   way as its neighbours.
2. Add the nav entry in the right shell (public header/footer, dashboard tab
   group, or updated-dashboard section) before styling the page.
3. Match the closest existing page pattern; do not invent a new shell for one
   screen.
4. Keep query-param deep links (`?category=`) working and shareable.

## Page patterns

- **Guest home (`/`)** — three sections: a two-column hero (eyebrow pill,
  bold slate headline with one sky gradient span, one-sentence explanation,
  primary + secondary CTA, three proof stats) with the relocation-progress
  card on the right; the partner/trust marquee; the service discovery grid.
  Keep the hero honest and scannable; no autoplay carousel, no video.
- **Dashboard (`/dashboard`)** — role-aware: greeting + role label, a small set
  of metric/status panels (orders, notifications, chats, finance,
  verification), each linking to its full page. Panels use a white surface, one
  hairline border, a small-caps header, rows with a status dot and right-aligned
  meta. Empty panels collapse to one sentence plus a link.
- **Services (`/services`)** — floating filter HUD (search, category,
  price/rating, sort), 9-card grid, pagination, dimmed grid while re-fetching,
  skeleton cards on first load, and an empty state with a clear-filters
  action. Filters reset pagination to page 1.
- **Service profile (`/service/:serviceId`)** — content column plus a sticky
  booking sidebar on `lg`; on phones the booking action becomes a sticky
  bottom bar. Gallery, provider block, inclusions, variants/timelines, and
  reviews. The price shown must match the selected variant or timeline.
- **Service creation wizard** — numbered steps with `WizardProgress` (basics,
  type & pricing, media, preview, review), a live preview beside the form on
  `lg`, back/next with validation per step, and a truthful summary before
  submit. Never lose entered data on step change.
- **Auth pages** — split layout: branded reassurance panel (`SigninLeftPanel`)
  plus the form. One submit action per page, inline field errors, disabled
  pending state, and a clear link back to sign-in. Role choice
  (individual vs provider) is a page decision, not a dropdown buried in the
  form.
- **Dashboards** — sidebar + topbar + content. Sidebar groups are labelled
  (Overview / Work / Finance / Account / Help), each row has an icon and an
  optional count badge, active state is obvious, and the collapsed state keeps
  icons with accessible names. Tables use `MultiUseTable`/`DynamicTable` with
  a sticky header, a scroll container on phones, and status badges; filters
  live in `FilterContainer`. Metric cards lead with the number and one label.
- **Timeline** (order journey) — vertical steps with dates, owner, state, and
  documents. Completed, current, and upcoming states are distinct without
  relying on colour alone.
- **Maintenance / 404** — one explanation, one way back (home or services),
  and the same header/footer as the rest of the public site.

## Component conventions

- **Folder shape:** routable pages in `src/pages/` or
  `src/features/<area>/pages/`; feature pieces in `src/features/<area>/`;
  shared primitives in `src/components/ui/`; tests next to the code when a test
  runner is configured (none on `main` yet).
- **Server state:** fetch in the page/container through `src/api/*`, pass data
  down as props. Presentational components stay pure. Global/shared state goes
  through the existing contexts; do not add a second auth or profile store.
- **Styling:** Tailwind utility classes in JSX. Reuse `glass-card`,
  `focus-glow`, `btn-ripple`, `animate-*`, and the `light-*` scale instead of
  re-deriving them. New global helpers go into `@layer components` in
  `client/src/index.css`; new theme values go into
  `client/tailwind.config.cjs`. Scoped one-off CSS is a last resort.
- **Icons:** `lucide-react` first, `size`/`strokeWidth` explicit, decorative
  icons `aria-hidden="true"`. No emoji in UI chrome (the older service card's
  `⭐` is debt). Every icon-only button needs an `aria-label` and a `title`
  is not a substitute.
- **Links and buttons:** React Router `Link` for internal navigation; anchors
  with `rel="noopener noreferrer"` for external. Do not use a clickable `div`
  for navigation — the service card currently does and should be fixed when
  touched (wrap the card in a `Link`, keep the favorite button outside the
  link or stop propagation).
- **Modals:** use `react-modal` with `ariaHideApp`, a labelled title, focus
  trap, Escape to close, and focus returned to the trigger. Do not nest a
  second modal inside a modal; use a step or a separate page.
- **Feedback:** inline `role="status"`/`role="alert"` for forms; toasts for
  background confirmations only; never toast an error the user must act on.
- **Motion:** CSS transitions by default, `framer-motion` only for genuinely
  spatial transitions (modals, sheets, wizard steps). Everything respects
  `prefers-reduced-motion`.
- **Images:** local fallback (`assets/placeholders/placeholder.png`) on error;
  `loading="lazy"` below the fold; `alt` describes the person/service, not
  "image".
- **Tests:** there is no test runner on `main` yet. When one is added, cover
  components that own logic (filtering, formatting, guard behaviour) and every
  bug fix; keep tests colocated.

## Designing a new feature

1. Read the closest existing page/component pair first — for example
   `pages/ServicesPage.jsx` + `features/service/ServiceGrid.jsx` +
   `features/service/ServiceCard.jsx`, or
   `features/service/creation/ServiceWizard.jsx` + its steps.
2. Place it in the navigation model **before** styling it: which shell, which
   nav group, which role, which URL.
3. Reuse tokens, `light-*` surfaces, and the component classes above. If a new
   token is genuinely needed, add it to the Tailwind config and document it
   here.
4. Wire real data through `src/api/*` and the existing contexts; do not
   hard-code counts, prices, or statuses.
5. Handle loading, empty, error, and permission-denied states before calling
   the happy path done.
6. Verify with `npm run lint --prefix client` and `npm run build --prefix client`
   (there is no test runner on `main`), plus a visual pass in `npm run dev`.

## UX review before shipping

There is no automated UX audit script in this repo; the review is manual.
Run the app (`npm run dev`) and check:

1. **Squint test** — the primary action is the first thing you see; the page
   has one clear entry point and one clear next step.
2. **Say it once** — no sentence, CTA, or nav row appears twice on the screen.
3. **320px** — no page scrolls sideways; the header keeps the account entry
   visible; the booking/checkout action is reachable; tables scroll inside
   their container, not the page.
4. **390px and 768px** — the grid reflows without orphaned cards, the filter
   HUD does not cover content, and the mobile menu is not trapped.
5. **Tab pass** — visible focus, logical order, no trap, Escape closes menus
   and modals and returns focus to the trigger.
6. **Role pass** — sign in as client, provider, and admin (or use the seeded
   dev accounts); each sees only its routes, tabs, and actions, and every
   empty/denied state offers a way forward.
7. **Truth pass** — prices, counts, statuses, verification badges, and time
   claims match the data; remove anything invented.
8. **Async pass** — slow the network in DevTools: skeletons match the final
   layout, buttons disable and relabel, errors appear where the action was,
   and a refresh does not repeat a one-shot message.

When the review changes a rule, update this file in the same change — it is
part of the product, not an afterthought.
