/// <reference types="vite/client" />

import { centerX, centerY } from '../state'
import { resolveCardEntry } from '../types'
import type { Preset } from '../types'
import { createCard } from '../components/Cards'

// loads presets and themes from the repo

const presetModules = import.meta.glob('/src/presets/*.json', { eager: true, import: 'default' }) as Record<
    string,
    Preset
>

export const PRESETS: Record<string, Preset> = Object.fromEntries(
    Object.entries(presetModules).map(([path, preset]) => [
        path
            .split('/')
            .pop()!
            .replace(/\.json$/, ''),
        preset,
    ]),
)

export const presetNames: string[] = Object.keys(PRESETS)

export function loadPreset(name: string): void {
    const preset: Preset | undefined = PRESETS[name]
    if (!preset) return

    document.documentElement.setAttribute('data-color-theme', preset.theme)

    for (const [cardName, entry] of Object.entries(preset.cards)) {
        createCard(cardName, resolveCardEntry(entry, { x: centerX, y: centerY }))
    }
}

export function safelyCheckPreset(preset: string): void {
    loadPreset(presetNames.includes(preset) ? preset : 'main')
}
