/// <reference types="vite/client" />

import { buttonClickSound, buttonPresetContent, buttonTheme, buttonThemeContent } from '../dom'
import { activeCards, clickSoundActive, setClickSound } from '../state'
import { removeCard } from './Cards'
import { loadPreset, presetNames } from '../core/loader'

// Handle the Toolbar elements outside of its type, changing state features and init internal parts for all buttons

const themeModules = import.meta.glob('/src/themes/*.scss')

const themeKeys: string[] = Object.keys(themeModules)
    .map((path) =>
        path
            .split('/')
            .pop()!
            .replace(/\.scss$/, ''),
    )
    .filter((key) => key !== 'base')

function themeLabel(key: string): string {
    return key
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export function initButtonTheme(): void {
    for (const key of themeKeys) {
        const anchor = document.createElement('a')

        anchor.href = `#${key}`
        anchor.textContent = themeLabel(key)
        anchor.className = 'theme-content-anchor'

        anchor.addEventListener('click', (e) => {
            e.preventDefault()
            setThemeButtonName(key)
            document.documentElement.setAttribute('data-color-theme', key)
            toggleDropdown()
        })

        buttonThemeContent.appendChild(anchor)
    }
}

export function initButtonPreset(): void {
    for (const name of presetNames) {
        const anchor = document.createElement('a')

        anchor.href = `#${name}`
        anchor.textContent = name
        anchor.className = 'preset-content-anchor'

        anchor.addEventListener('click', (e) => {
            e.preventDefault()
            checkPreset(name)
            togglePresetDropdown()
        })

        buttonPresetContent.appendChild(anchor)
    }
}

export function toggleDropdown(): void {
    buttonThemeContent.style.display = buttonThemeContent.style.display === 'flex' ? 'none' : 'flex'
}

export function togglePresetDropdown(): void {
    buttonPresetContent.style.display = buttonPresetContent.style.display === 'flex' ? 'none' : 'flex'
}

export function toggleClickSound(): void {
    buttonClickSound.innerHTML = clickSoundActive ? 'Turn on click sound' : 'Turn off click sound'
    setClickSound(!clickSoundActive)
}

export function setThemeButtonName(key: string | null): void {
    if (key === null || !themeKeys.includes(key)) {
        buttonTheme.innerHTML = "This isn't working...?"
        return
    }
    buttonTheme.innerHTML = themeLabel(key)
}

export function checkPreset(preset: string): void {
    activeCards.forEach((card) => removeCard(card))
    loadPreset(preset)
}
