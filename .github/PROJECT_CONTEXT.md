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

## Getting Started

1. Copy `.env.example` to `.env` and adjust values
2. Install deps: `bun install` (or `npm i`)
3. Run dev server: `bun run dev` (or `npm run dev`)
4. Visit http://localhost:5173

## Build & Deploy

`bun run build` (or `npm run build`) produces optimized assets in `dist/` suitable for static hosting.

---

Maintained by @AyoubBourhfella
