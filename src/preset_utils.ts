import { centerX, centerY, createCard, validPresets } from './main'
import { Preset } from './types'

export async function safetlyCheckPreset(preset: string) {
    if (validPresets.includes(preset)) {
        loadPreset(preset)
    } else {
        loadPreset("general")
    }
}

export async function loadPreset(name: string): Promise<void> {
  const preset: Preset = await fetch(`/presets/${name}.json`).then(r => r.json())

  document.documentElement.setAttribute('data-color-theme', preset.theme)

  for (const [cardName, entry] of Object.entries(preset.cards)) {
    const [x, y] = entry.coords
    if (entry.center) {
        createCard(cardName, centerX, centerY, false)
        continue
    }

    createCard(cardName, x, y, true)
  }
}