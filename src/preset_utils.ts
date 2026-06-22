import { centerX, centerY, createCard, validPresets } from './main'
import { Preset } from './types'

export async function safetlyCheckPreset(preset: string) {
    if (validPresets.includes(preset)) {
        loadPreset(preset)
    } else {
        loadPreset("main")
    }
}

export async function loadPreset(name: string): Promise<void> {
  const preset: Preset = await fetch(`/presets/${name}.json`).then(r => r.json())

  document.documentElement.setAttribute('data-color-theme', preset.theme)

  for (const [cardName, entry] of Object.entries(preset.cards)) {
    const [x, y] = entry.coords

    if (entry.random) {
        createCard(cardName, getRandomIntInclusive(-x, x), getRandomIntInclusive(-y, y), false, entry.protected)
        continue
    }

    if (entry.center) {
        createCard(cardName, centerX, centerY, false, entry.protected)
        continue
    }

    createCard(cardName, x, y, true, entry.protected)
  }
}

function getRandomIntInclusive(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}