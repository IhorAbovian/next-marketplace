# AGENTS.md

This file provides guidance to any AI agent (claude code, codex, copilot, etc) when working with code in this repository.

## Overview

Next.js 16 (App Router) marketplace application — listings with categories, favorites, buyer/seller profiles, in-app chat, and view tracking. Postgres via Prisma, auth via better-auth (Google OAuth), images via Cloudinary, UI via shadcn/ui + Tailwind v4.

## Commands

- `npm run dev` — start dev server (Turbopack disabled: `TURBOPACK=false`)
- `npm run dev-win` — dev server with Turbopack enabled (default), for Windows where the disabled-Turbopack flag can misbehave
- `npm run build` / `npm run start` — production build / start
- `npm run lint` — ESLint (flat config, `eslint-config-next`)
- `npm run gen` — run pending Prisma migrations (`prisma migrate dev`) then regenerate the client; run this after any `prisma/schema.prisma` change
- `npm run ps` — open Prisma Studio

There is no test suite configured in this repo.

## Architecture

### Data model (`prisma/schema.prisma`)

Client generates to `generated/prisma` (not `node_modules/.prisma`), imported via `lib/prisma.ts`, which wraps a singleton `PrismaClient` using `@prisma/adapter-pg` over `DATABASE_URL`.

Key models and relations:
- `User` — has one `Buyer` and/or one `Seller` sub-profile, many `Listing`s (as author), `Favorite`s, `ListingView`s.
- `Listing` — belongs to a `Category` and an author `User`; has `status` (`ACTIVE | HIDDEN | SOLD`), a denormalized `viewCount`, `Image[]`, and `ListingView[]`.
- `Category` — self-referential parent/children hierarchy (`CategoryHierarchy` relation).
- `Favorite` — unique per `(userId, listingId)`.
- `ListingView` — unique per `(userId, listingId)`, used to dedupe view tracking that feeds `Listing.viewCount`.
- `Chat` / `ChatMessage` — a chat is scoped to `(buyerId, sellerId, listingId)`; messages carry `isRead` for read-state tracking.

### Routing (`app/`)

Flat App Router structure, no route groups, single root `app/layout.tsx`. Notable routes: `create-listing`, `edit-listing/[id]`, `listings/[...slug]` (catch-all), `messages`, `profile`, `search`, `sign-in`. `app/test-forms/**` is a scratch area comparing form-handling approaches (client state vs react-hook-form+zod vs server actions) — not production UI.

Mutations go through **server actions** in `lib/actions.ts` (`"use server"`), validated against zod schemas in `lib/schemas/`. **API routes** (`app/api/*/route.ts`) are reserved for cases server actions don't fit: `api/auth/[...all]` (better-auth catch-all handler), `api/upload` (Cloudinary upload, multipart), `api/avatar`. Follow this split for new mutations — prefer a server action unless it needs to be a REST-style endpoint (webhook, file upload, third-party callback).

Read-side data fetching helpers (with typed Prisma payloads, e.g. `ListingWithCategory`) live in `lib/data.ts`.

### Auth

better-auth, configured in `lib/auth.ts` (server instance — Google OAuth, JWT session cookie cache, `getSession()`/`getAuthenticatedUser()` helpers) and `lib/auth-client.ts` (client-side hooks). The HTTP handler is mounted at `app/api/auth/[...all]/route.ts`.

Route protection is enforced in `proxy.ts` at the repo root — this is a Next.js middleware file (uses the `middleware.ts` matcher convention but is named/exported as `proxy`, matching `next.config.ts`/this project's setup, not the framework default filename). It redirects unauthenticated users away from `protectedRoutes` and authenticated users away from `loginRoutes`; excludes `/api`, `_next/static`, `_next/image`, and `*.png` via its matcher. Add new protected paths to the `protectedRoutes` array here, not via per-page checks.

### Components

`components.json` configures shadcn/ui (style `base-nova`, neutral base color, RSC on, plus a custom `@reui` registry) — use the `shadcn` CLI/skill to add new primitives rather than hand-rolling them. `components/ui/` holds shadcn primitives but also some app-specific components that were placed there directly (`Header`, `Footer`, `SearchBar`, `ProfileMenu`, etc.) rather than a feature folder — check there before assuming it's primitives-only. Feature-specific components are otherwise organized under `components/buttons/`, `components/cards/`, `components/profile/`, `components/sections/`.

### Config

- Path alias: `@/*` maps to the repo root (`tsconfig.json`), so imports are repo-root-relative, not `src`-relative.
- `next.config.ts` only whitelists remote image hosts (`placehold.co`, `res.cloudinary.com`).
- ESLint flat config extends `eslint-config-next`; `no-console` is a warning, `react/no-unescaped-entities` is disabled.
- Required env vars (no `.env.example` present — check with the user before assuming a value): `DATABASE_URL`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CLOUDINARY_URL`.
