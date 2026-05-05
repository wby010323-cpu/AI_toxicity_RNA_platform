# AI-Safe Food Safety Platform

## Overview

A proof-of-concept AI-assisted platform for food-related transcriptomic data upload, toxicity interpretation, and automated report generation.

## Architecture

- **Frontend**: React 18 + Vite + Tailwind CSS + shadcn/ui components
- **Backend**: Express.js (TypeScript) serving both API and client
- **Database**: PostgreSQL via Drizzle ORM (currently using in-memory storage)
- **Routing**: Wouter (client-side), Express (server-side API)

## Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── pages/   # Route pages (home, not-found)
│   │   ├── components/  # UI components (shadcn/ui)
│   │   ├── hooks/   # Custom React hooks
│   │   └── lib/     # Utilities, query client
│   └── index.html
├── server/          # Express backend
│   ├── index.ts     # Entry point (port 5000)
│   ├── routes.ts    # API routes
│   ├── storage.ts   # Storage interface (MemStorage)
│   ├── static.ts    # Static file serving (production)
│   └── vite.ts      # Vite dev server integration
├── shared/          # Shared types/schemas
│   └── schema.ts    # Drizzle schema (users table)
├── script/
│   └── build.ts     # Production build script
├── vite.config.ts   # Vite configuration
├── drizzle.config.ts
└── tailwind.config.ts
```

## Development

- Run: `npm run dev` (starts Express + Vite on port 5000)
- Build: `npm run build`
- DB push: `npm run db:push` (requires DATABASE_URL)

## Main App Features (home.tsx)

### Two Analysis Modes
- **Validation Mode** — User knows the ground-truth label (Toxic / Non-Toxic). Upload data, provide label, run model, compare prediction vs. label. If matched, user is invited to consent to contribute the anonymized sample to the reference database.
- **Prediction Mode** — User does not know the label. Upload data, run model, receive prediction + confidence + interpretation summary. No database contribution prompt.

### UI Sections (in order)
1. `Hero` — Branding, entry CTAs
2. `About` — 4-feature overview cards
3. `Workflow` — Two-mode flow diagrams (Validation / Prediction)
4. `ModeSelector` — Two large selectable cards; mode state lifted to `Home`
5. `UploadSection` — Mode-aware: shows ground-truth field only in Validation Mode; "Run AI-Safe Prediction" button; mock 2.2s delay simulates inference
6. `ResultsSection` — Dynamic: Validation shows prediction + match status + optional contribution panel; Prediction shows simpler result + disclaimer
7. `Database` — Updated wording: consent-based, curated contributions
8. `Ethics` — Revised data policy language
9. `Footer`

### State architecture
- `analysisMode` and `analysisResult` live in the top-level `Home` component
- Props passed down to `ModeSelector`, `UploadSection`, `ResultsSection`
- Mock backend hook-ready: `onResult` callback in `UploadSection` is where real API call goes

## Key Notes

- Dev server serves both API (`/api/*`) and React frontend on port 5000
- Host is `0.0.0.0` for Replit proxy compatibility
- `allowedHosts: true` set in Vite middleware config
- Storage uses in-memory by default; PostgreSQL supported via DATABASE_URL env var

## Deployment

- Target: autoscale
- Build: `npm run build`
- Run: `node dist/index.cjs`
