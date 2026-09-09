# Binaris Portfolio Website

Official repository for my personal website. I wanted to make something unique, and I always liked the 'canvas' idea for something like this, so I made this.

There isn't too much documentation for this because I don't like web development, because of this I made small comments in some parts of the project, they could be a little dumb.

## How to build and preview the site

*I write this because I'm sure I will forget how to do it :p*

1. use `npm run build`, this will generate everything needed in the dist/ folder (including the cards/assets copied automatically, excluding `.obsidian`)
2. use `npm run preview` to check the created files
3. push/copy the dist folder with its contents to neocities

(In case the profile picture of neocities doesn't update click/unclick parts of the settings)

## Useful commands

- `npm run dev`: dev server
- `npm run build`: production build into dist/
- `npm run preview`: serve the built dist/ for testing

## Content

- Obsidian vault with the markdown/assets content, this is located inside `cards/`
- Presets, each one can have a different set of cards with a location, located inside `src/presets/`. You can set different values to have more freedom in this aspect:
  - You define that a card can be centered with `center`
  - `offset` define the position based by the center of the page (this is responsive(?))
  - Cards can get placed randomly with `random` and `[-x..x, -y..y]`
  - Different themes with colors/card style/background