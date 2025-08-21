<div align="center">
	<h1>🌸 PetalFlow Showcase</h1>
	<p><strong>A polished floral e‑commerce style demo built with React, TypeScript, Vite, Tailwind & shadcn-ui.</strong></p>
	<p>Animated hero • Mega menu • Search • Reviews • Custom bouquet builder • Environment‑driven branding</p>
</div>

---

## Table of Contents

1. Overview
2. Features
3. Tech Stack
4. Quick Start
5. Environment Variables
6. Project Structure
7. State Management
8. Animations
9. Scripts
10. Contributing
11. Future Ideas
12. License / Attribution

---

## 1. Overview

PetalFlow Showcase is a front‑end reference implementation for a premium flower shop experience. It focuses on refined motion design, modular UI primitives, SEO‑conscious structure, and configurable branding via environment variables.

## 2. Features

- ✨ Animated parallax Hero with configurable background & tagline
- 🧭 Mega menu navigation (Shop / Info) + keyboard shortcuts ("/" to focus search)
- 🔍 Unified search across flowers & bouquets (title, slug, description)
- 🏷️ Occasions taxonomy filtering page
- 💐 Custom Bouquet builder (choose stems & counts)
- ⭐ Product reviews with localStorage persistence & aggregate rating
- 🧵 Structured data (Product + Breadcrumb JSON-LD)
- 🧭 Centralized breadcrumbs from route metadata
- 💸 Feature flag to hide/show prices (`VITE_SHOW_PRICES`)
- 🌀 Global animated loading screen + performance timing slice
- 🌸 Ambient falling sakura petals layer
- 🌱 Environment-driven branding (name, tagline, hero image, contacts)

## 3. Tech Stack

| Aspect             | Tech                             |
| ------------------ | -------------------------------- |
| Build Tool         | Vite                             |
| Framework          | React 18 + TypeScript            |
| State              | Redux Toolkit                    |
| UI Primitives      | shadcn-ui (Radix) + Tailwind CSS |
| Animations         | Framer Motion                    |
| Carousel           | Embla                            |
| Forms / Validation | React Hook Form + Zod (planned)  |

## 4. Quick Start

Clone and run with Bun (preferred) or npm.

```bash
git clone <REPO_URL>
cd petal-flow-showcase

# Copy environment template
cp .env.example .env

# Install deps (auto-detects Bun via bun.lockb)
bun install  # or: npm install

# Start dev server
bun run dev  # or: npm run dev
```

Visit: http://localhost:5173

## 5. Environment Variables

All branding & contact data is controlled via Vite env vars. Edit `.env` (restart dev server after changes):

| Variable             | Purpose                  | Example                     |
| -------------------- | ------------------------ | --------------------------- |
| VITE_SHOW_PRICES     | Toggle price visibility  | true                        |
| VITE_SITE_NAME       | Brand name               | PetalFlow                   |
| VITE_SITE_TAGLINE    | Short tagline            | Crafting Digital Beauty     |
| VITE_BRAND_LOGO      | Logo path/URL (optional) | /logo.svg                   |
| VITE_HERO_IMAGE      | Override hero bg image   | /hero.jpg                   |
| VITE_CONTACT_EMAIL   | Contact email            | hello@example.com           |
| VITE_CONTACT_PHONE   | Phone                    | +1 (555) 123-4567           |
| VITE_CONTACT_ADDRESS | Address                  | 123 Blossom Ave             |
| VITE_CONTACT_GITHUB  | GitHub/org link          | https://github.com/your-org |

See `.env.example` for defaults.

## 6. Project Structure (Key Paths)

```
src/
	components/         # Reusable UI & feature components
	pages/              # Route-level components
	store/              # Redux slices & store setup
	lib/branding.ts     # Env-based branding helpers
	lib/routeMeta.ts    # Route metadata for breadcrumbs / JSON-LD
	assets/             # Static images
```

## 7. State Management

Redux Toolkit slices:

- flowersSlice / bouquetsSlice: catalog data
- customBouquetSlice: mutable custom design
- reviewsSlice: localStorage-persisted user reviews
- timerSlice: performance & loader timing metrics

## 8. Animations

Framer Motion powers:

- Page transitions (`PageTransition`)
- Hero entrance & parallax
- Loading screen progress & transformation
- Mega menu panels & hover micro-interactions

Follow the variants pattern for consistency and easier reduced-motion adaptation (future enhancement).

## 9. Scripts

| Script    | Description                         |
| --------- | ----------------------------------- |
| dev       | Start dev server                    |
| build     | Production build                    |
| build:dev | Development-mode build (unminified) |
| lint      | Run ESLint                          |

Type checking: `npx tsc --noEmit` (CI runs this automatically).

## 10. Contributing

We use standard GitHub flow:

1. Fork / branch from `main`
2. Create descriptive branch name (e.g. `feat/search-highlighting`)
3. Commit with clear messages (Conventional style encouraged)
4. Open PR using the provided template
5. Ensure CI passes (lint, type check, build)

Issue templates provided for bugs & feature requests under `.github/ISSUE_TEMPLATE`.

### Code Quality

- Keep components focused; extract shared logic to `lib/` or hooks
- Prefer TypeScript strictness; add types near usage if small
- Avoid premature abstraction—wait for a second usage

## 11. Future Ideas (Backlog)

- Server-backed products & review API
- Fuzzy search (e.g. fuse.js) with highlight
- Theming + dark mode refinement
- Accessibility audit & reduced motion support
- Image optimization / responsive sources
- Persist custom bouquet designs

## 12. License / Attribution

No explicit license declared yet. Consider adding `MIT` or a custom license if you intend public reuse.

---

Maintained by **@AyoubBourhfella**. Contributions & suggestions welcome.

Enjoy the blooms! 🌷
