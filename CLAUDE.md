# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm astro check  # TypeScript type-check (0 errors expected)
pnpm preview      # preview production build
```

## Tech Stack Decisions

**Tailwind CSS v4** is integrated via `@tailwindcss/vite` (a Vite plugin), NOT `@astrojs/tailwind`. The `@astrojs/tailwind` package is incompatible with both Astro 6 and Tailwind v4. There is no `tailwind.config.js` — all theme tokens are defined in `src/styles/global.css` using the `@theme {}` directive.

**No Content Collections.** Astro 6 removed the legacy `src/content/config.ts` API. Fighter data lives in `src/data/fighters/*.json` and is imported directly in `src/lib/fighterContent.ts` — the Astro Content Collections API is not used.

## Architecture

The app is a single page with a React state machine mounted in `src/pages/index.astro` via `<App client:load />` inside `<RetroWrapper>`.

### State Machine

`AppContext` (`src/context/AppContext.tsx`) drives all screen transitions via `useReducer`:

```
title → menu → character-select
              ↗
        secret-menu (boss-toggle / sound-test sub-screens)
```

`AppScreen` type and all `AppAction` variants are in `src/types/state.ts`.

### Screen Components

Each screen is a self-contained React component that reads from `useAppState()` and dispatches actions:

- `MenuPrincipal.tsx` — handles `title`, `menu`, and `secret-menu` screens. Has an internal `MenuPhase` state to avoid extra app-level states for the sub-menus.
- `CharacterGrid.tsx` — the Kombat Zone selector. Manages flash/curtain timing with `setTimeout`.

### Data Layer

| File | Purpose |
|---|---|
| `src/lib/fighters.ts` | All 26 fighter asset paths + Genesis grid order. Source of truth for `FIGHTERS_GRID`, `FIGHTER_BY_ID`, `GRID_ROW_WIDTHS`. |
| `src/lib/audio.ts` | All audio file paths. Filenames contain spaces — use as string literals; browsers handle them natively without `encodeURIComponent`. |
| `src/lib/cheatCode.ts` | Cheat sequence constant: `a c ArrowUp b ArrowUp b a ArrowDown` |
| `src/lib/fighterContent.ts` | Static map of all 26 JSON imports → `FIGHTER_CONTENT[id]` |
| `src/data/fighters/*.json` | Per-fighter bio, special moves, fatalities |

### Character Grid Layout (Genesis faithful)

The grid uses an irregular layout mirroring the original Sega Genesis game:
- Row 0–1: 7 columns each
- Row 2–3: 5 columns each (centered)
- Optional boss row: 2 slots (Motaro + Shao Kahn), shown when `bossesEnabled`

`useGridInput` (`src/hooks/useGridInput.ts`) handles this irregular navigation: ArrowUp/Down clamp the column index to `min(col, targetRowWidth - 1)` when crossing between 7-col and 5-col rows.

### Known Asset Anomalies

These are hardcoded in `src/lib/fighters.ts` and must not be "corrected":
- `subzero/subzero.png` — selector image uses fighter name, not `selector.png`
- `shaokahn/seelctor.png` — typo on disk (double `e`)
- `shaokahn` and `motaro` — no `versus.png` (field is `null`)
- `jax`, `kunglao`, `sektor` — victory asset is `.gif`, not `.png`

### Audio

`SoundContext` (`src/context/SoundContext.tsx`) manages a single looping BGM `<Audio>` ref. `playBgm()` skips restart if the same track is already playing. Autoplay `DOMException` is silently swallowed — audio starts only after the first user interaction.

### Retro Visual Rules

- **No smooth easing anywhere.** `global.css` forces `transition-timing-function: step-start !important` on `*`.
- **Pixelated rendering.** All `<img>` globally: `image-rendering: pixelated`.
- **CRT effect.** `RetroWrapper.astro` applies scanlines via `::after` and a vignette via `::before`. Both are `pointer-events: none` at `z-index: 998/999`.
- **Flash/curtain.** `CharacterGrid` uses CSS keyframes `mk-flash` (white overlay, 200ms) and `mk-curtain-in` (black scaleY, 300ms). Both use `step-start` timing.
