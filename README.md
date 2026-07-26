# ApexFit — Dashboard Prototype

A hyper-personalized AI fitness & nutrition dashboard. Dark-mode, 3-column
"instrument panel" layout: pantry-to-plate meal generation, a live 3D muscle
heatmap avatar, and an AI form coach with a simulated AR pose overlay.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + custom design tokens, **shadcn/ui**-style primitives, **lucide-react**
- **Zustand** for dashboard state (`lib/store.ts`)
- **@react-three/fiber** / **three.js** for the 3D avatar; **@tensorflow-models/pose-detection**
  wired at the hook boundary (`components/dashboard/AICoachHUD.tsx` currently runs a
  simulated skeleton — see the comment block in that file for where to swap in the
  real MoveNet detector against a live `<video>` stream)
- **Prisma** + **PostgreSQL** (`prisma/schema.prisma`)

## Directory structure

```
app/
  layout.tsx                     Root layout, font loading, metadata
  page.tsx                       Redirects "/" -> "/dashboard"
  globals.css                    Design tokens, HUD reticle signature element
  dashboard/
    page.tsx                     3-column grid composing all panels
  api/
    recipes/generate/route.ts    Mock macro-matched recipe generator
    workouts/pose-log/route.ts   Mock pose-log ingestion endpoint

components/
  dashboard/
    Header.tsx                   Branding, streak badge, live HRV widget
    PantryToPlate.tsx             Left panel
    3DVisualizer.tsx              Center panel (dynamically imported, ssr:false)
    AICoachHUD.tsx                Right panel
    MacroBar.tsx                  Bottom bar
  ui/                             button, card, badge, progress, checkbox, slider, avatar

lib/
  store.ts                        Zustand store — single source of truth for all panels
  utils.ts                        cn() class-merge helper

types/
  dashboard.ts                    Shared domain types

prisma/
  schema.prisma                   User, PantryItem, Recipe, RecipeIngredient,
                                   WorkoutSession, PoseLog, MuscleActivation
```

## Getting started

```bash
npm install
cp .env.example .env      # then set DATABASE_URL
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000 — it redirects straight to `/dashboard`.

## Design notes

- Palette: cool graphite background (`#0A0E0E`), a bioluminescent teal
  "signal" accent for live/positive data, and a warm ember accent reserved
  for time-pressure states (circadian window, low recovery).
- All live numbers (macros, FPS, %, kcal) render in `font-mono` — a
  deliberate "instrument panel" read, distinct from body copy.
- The `hud-frame` utility class (see `globals.css`) draws corner reticle
  brackets on the two panels that represent "the system is watching you"
  (3D visualizer, AR coach feed) — that framing is the page's signature
  element, not decoration.

## Wiring real data (next steps)

- Replace the seeded Zustand values with a fetch from `/api/*` on mount,
  or convert panels to Server Components backed by Prisma queries.
- Swap `useSimulatedPose` in `AICoachHUD.tsx` for a real MoveNet detector
  reading a `<video>` element's `MediaStream`, POSTing each frame's
  keypoints to `/api/workouts/pose-log`.
- Point the "Order Ingredients" CTA at the Blinkit/Zepto partner API once
  credentials are available.
