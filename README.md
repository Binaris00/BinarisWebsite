# Binaris Website

Official repository to my personal canvas website.

## How to build and preview the site

*I write this because I'm sure I will forget how to do it*

1. use `npm run build`, this will generate everything needed in the dist/ folder (including the cards/assets copied automatically, excluding `.obsidian`)
2. use `npm run preview` to check the created files
3. push/copy the dist folder with its contents to neocities

(In case the profile picture of neocities doesn't update click/unclick parts of the settings)

## Useful commands

- `npm run dev` — dev server
- `npm run build` — production build into dist/
- `npm run preview` — serve the built dist/
- `npm run test` — run vitest unit tests
- `npm run typecheck` — TypeScript check (no emit)
- `npm run lint` — ESLint
- `npm run format` — Prettier

## Content

- `cards/` — Obsidian vault with the markdown cards (images live in `cards/assets/imgs/`). They are bundled into the build, so after editing run `npm run build` again.
- `src/presets/*.json` — preset layouts. Each entry has a `mode`:
  - `center` — placed at the center of the viewport
  - `offset` — `x`/`y` are offsets from the center of the viewport
  - `absolute` — `x`/`y` are raw coordinates
  - `random` — placed at a random position within `[-x..x, -y..y]`
- `src/themes/` — theme stylesheets. Each file (except `base.scss`) becomes an available theme by its filename.
