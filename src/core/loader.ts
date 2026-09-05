import { centerX, centerY, validPresets } from '../state';
import { createCard } from './canvas';
import { Preset } from '../types';


export async function loadPreset(name: string): Promise<void> {
    const preset: Preset = await fetch(`/presets/${name}.json`).then(r => r.json())

    document.documentElement.setAttribute('data-color-theme', preset.theme)

    for (const [cardName, entry] of Object.entries(preset.cards)) {
        const [x, y] = entry.coords

        if (entry.random) {
            createCard(cardName, getRandomIntInclusive(-x, x), getRandomIntInclusive(-y, y), false)
            continue
        }

        if (entry.center) {
            createCard(cardName, centerX, centerY, false)
            continue
        }

        createCard(cardName, x, y, true)
    }
} export async function safetlyCheckPreset(preset: string) {
    if (validPresets.has(preset)) {
        loadPreset(preset);
    } else {
        loadPreset("main");
    }
}
export function getRandomIntInclusive(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

