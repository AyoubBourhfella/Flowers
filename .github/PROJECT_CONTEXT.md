# Project Context

## Overview

PetalFlow Showcase is a Vite + React + TypeScript single-page application demonstrating a refined floral e‑commerce experience with animated navigation, product browsing, reviews, custom bouquet builder, and environmental configuration for branding & pricing.

## Key Features

- Mega menu navigation (Shop / Info) with keyboard shortcuts and mobile drawer
- Animated hero with parallax scroll and configurable hero background (env)
- Product catalog: flowers & bouquets (Redux slices)
- Occasions filtering page combining taxonomies
- Custom Bouquet builder (stateful, Redux slice)
- Reviews system with localStorage persistence & aggregate rating
- Structured data (JSON-LD) for products & breadcrumbs
- Centralized breadcrumbs via route metadata
- Search across flowers & bouquets (title, slug, description)
- Loading screen with animated progress + timing metrics slice
- Sakura petals ambient animation overlay
- Feature flag for price display (VITE_SHOW_PRICES)
- Environment-driven branding (name, tagline, hero image, contacts, GitHub)

## Tech Stack

- React 18, TypeScript, Vite
- Redux Toolkit for state slices (flowers, bouquets, customBouquet, reviews, timer)
- Framer Motion for animation & page transitions
- shadcn-ui (Radix primitives) + Tailwind CSS for UI
- Embla carousel for featured items
- Zod, React Hook Form (forms where applicable)

## State Slices

- flowersSlice / bouquetsSlice: static product data + descriptions
- customBouquetSlice: user-selected stems & counts
- reviewsSlice: addReview, persisted in localStorage
- timerSlice: app & loading timestamps (performance metrics)

## Environment Variables (.env)

Refer to `.env.example`:

- VITE_SHOW_PRICES
- VITE_SITE_NAME / VITE_SITE_TAGLINE / VITE_HERO_IMAGE / VITE_BRAND_LOGO
- VITE_CONTACT_EMAIL / VITE_CONTACT_PHONE / VITE_CONTACT_ADDRESS / VITE_CONTACT_GITHUB

## Directory Highlights

- `src/components/Navigation.tsx`: Mega menu & responsive nav
- `src/components/Hero.tsx`: Parallax hero section using env branding
- `src/components/LoadingScreen.tsx`: Global loader (wrapped by `AppLoader`)
- `src/components/AppLoader.tsx`: Global loader wrapper
- `src/components/Footer.tsx`: Uses env branding & contact details
- `src/lib/branding.ts`: Central branding/env resolution
- `src/lib/routeMeta.ts`: Route metadata for breadcrumbs & structured data
- `src/pages/*`: Page-level components
- `src/store/*`: Redux slices & store setup

## Workflows

- GitHub Actions CI (`.github/workflows/ci.yml`): install (Bun or npm), lint, type-check, build.

## Conventions

- Use environment variables (Vite `import.meta.env`) for any deploy-time branding
- Keep animation logic declarative (Framer Motion variants)
- Reuse utility helpers in `lib` rather than duplicating logic

## Future Ideas

- Server-backed products & reviews (replace static slices)
- Image optimization / responsive sources
- Advanced search (fuse.js fuzzy, highlighting)
- Accessibility pass (focus traps, reduced motion preferences)
- Theming (dark/light improvements + custom palettes)

## Domain Model & Data Structures (Current Front-End)

These are in-memory (Redux) currently; an admin panel would persist & manage them via an API.

### Entities

1. Flower

   - id (string | slug)
   - name / title
   - description
   - price (number) — hidden if `VITE_SHOW_PRICES=false`
   - category (e.g. Roses, Lilies)
   - image (static asset path)
   - tags / occasions? (extensible)

2. Bouquet

   - id / slug
   - title
   - description
   - price (optional if flag off)
   - image
   - composition (array of { flowerId, stems }) — currently implicit / not enforced
   - tags / occasions

3. Occasion (taxonomy)

   - key (string)
   - label
   - associatedProductIds (derived many‑to‑many)

4. Review

   - id (uuid)
   - productType (flower | bouquet)
   - productId
   - rating (1–5)
   - authorName
   - text
   - createdAt (timestamp)
   - persisted localStorage (will migrate to API)

5. CustomBouquetDraft

   - id (client uuid)
   - items: array<{ flowerId, quantity }>
   - name (user supplied)
   - notes (optional)
   - estimatedPrice (derived)

6. Branding / Config (env based now)

   - siteName
   - tagline
   - heroImage
   - contact: { email, phone, address, github }
   - featureFlags: { showPrices }

7. PerformanceTiming
   - appStart
   - loadingStart / loadingEnd
   - contentShown

### Current Slice → Potential Backend Table Mapping

| Redux Slice         | Proposed Table / Collection | Notes                                                     |
| ------------------- | --------------------------- | --------------------------------------------------------- |
| flowersSlice        | flowers                     | Seed initial data; add soft delete flag                   |
| bouquetsSlice       | bouquets                    | Add relation table bouquet_flowers if composition tracked |
| reviewsSlice        | reviews                     | Index on productId + createdAt                            |
| customBouquetSlice  | custom_bouquet_drafts       | Auth-bound; ephemeral or convertible to order             |
| (occasions derived) | occasions                   | Many-to-many join with products                           |
| timerSlice          | perf_events                 | Optional analytics stream                                 |
| branding/env        | settings                    | Only mutable via admin (NOT env) in future                |

### Derived / Computed Fields

- Aggregate rating per product = avg(rating) & count.
- Availability status (future) could be computed from inventory table.

## Admin Panel Blueprint

Goal: Manage catalog, taxonomy, reviews moderation, branding & feature flags.

### Suggested Folder Structure

```
src/
	admin/
		layout/          # Admin shell (sidebar, topbar)
		routes/
			dashboard.tsx
			products/
				FlowersList.tsx
				FlowerEdit.tsx
				BouquetsList.tsx
				BouquetEdit.tsx
			occasions/
				OccasionsList.tsx
				OccasionEdit.tsx
			reviews/
				ReviewsModeration.tsx
			settings/
				BrandingSettings.tsx
				FeatureFlags.tsx
		components/
			DataTable.tsx
			FormField.tsx
			ConfirmDialog.tsx
		hooks/
			useAdminAuth.ts
			useMutationToast.ts
		api/              # API client wrappers (REST or GraphQL)
```

### Routing Strategy

- Mount under `/admin` with protected routes.
- Use a separate React Query client instance or share existing with admin-specific query keys (`admin:flowers`, etc.).
- Lazy load admin bundle: dynamic import boundary at `/admin` root.

### Auth & Security (Planned)

- JWT or session cookie; minimal RBAC roles: `admin`, `editor`, `viewer`.
- Protect API endpoints server-side; front-end role gates hide disallowed actions.

### API Surface (Proposed REST)

| Resource      | Method | Path                      | Action           |
| ------------- | ------ | ------------------------- | ---------------- |
| Flowers       | GET    | /api/flowers              | List             |
|               | POST   | /api/flowers              | Create           |
|               | GET    | /api/flowers/:id          | Read             |
|               | PUT    | /api/flowers/:id          | Update           |
|               | DELETE | /api/flowers/:id          | Soft delete      |
| Bouquets      | GET    | /api/bouquets             | List             |
|               | POST   | /api/bouquets             | Create           |
|               | PUT    | /api/bouquets/:id         | Update           |
| Reviews       | GET    | /api/reviews?pending=true | List unmoderated |
|               | PATCH  | /api/reviews/:id          | Approve / flag   |
| Occasions     | GET    | /api/occasions            | List             |
|               | POST   | /api/occasions            | Create           |
| Settings      | GET    | /api/settings/branding    | Fetch branding   |
|               | PUT    | /api/settings/branding    | Update branding  |
| Feature Flags | GET    | /api/settings/flags       | Fetch flags      |
|               | PUT    | /api/settings/flags       | Update flags     |

### Data Validation / Forms

- Use Zod schemas per entity (shared between admin & public app in `src/schemas/`).
- Auto-generate form resolvers with `@hookform/resolvers/zod`.

### Component Patterns

- DataTable: generic with columns config, sorting, pagination.
- Edit forms: split into `FormFields` + container handling submit/mutate.
- Modals for destructive actions (delete, reset settings).

### Styling & UI

- Reuse existing shadcn components; extend tokens for admin palette if needed.
- Keep admin layout visually distinct (neutral background vs. floral gradients) for context switching.

### Performance & Caching

- React Query for CRUD cache; invalidate list queries after mutations.
- Optimistic updates for review moderation & flags.

### Testing Strategy (Future)

- Component tests: vitest + @testing-library/react for forms & tables.
- Integration: mock handlers via MSW for API endpoints.
- E2E: Playwright focusing on critical flows (create flower, edit bouquet, approve review, update branding).

### Migration Path

1. Extract static data from slices into JSON seeds.
2. Introduce lightweight API (Node/Express, or serverless functions).
3. Replace slice initial states with async fetch + loading skeletons.
4. Layer admin CRUD screens; guard with mock auth.
5. Move branding/env values into persisted settings table; fallback to env defaults.

### Risks / Considerations

- Keeping env vs. database settings consistent; define precedence (DB > env unless missing).
- Review spam & moderation queue size — consider pagination + rate limiting.
- Bouquet composition editing UI complexity (drag & quantity vs. simple multi-select).

### Minimal Viable Admin (Phase 1)

- Dashboard cards: counts (flowers, bouquets, pending reviews)
- List + edit: Flowers, Bouquets
- Reviews moderation approve/flag
- Branding settings (site name, tagline, hero image URL, contact)
- Feature flags toggle for prices

### Phase 2 Enhancements

- Occasion taxonomy CRUD & mapping UI
- Bouquet composition builder (select flowers + stems)
- User / Role management
- Audit log (settings + destructive actions)

### Phase 3

- Inventory tracking & availability statuses
- Order simulation / checkout integration
- Analytics (views, conversion funnels)

## Getting Started

1. Copy `.env.example` to `.env` and adjust values
2. Install deps: `bun install` (or `npm i`)
3. Run dev server: `bun run dev` (or `npm run dev`)
4. Visit http://localhost:5173

## Build & Deploy

`bun run build` (or `npm run build`) produces optimized assets in `dist/` suitable for static hosting.

---

Maintained by @AyoubBourhfella
