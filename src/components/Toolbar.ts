import { removeCard } from '../core/canvas';
import { loadPreset } from '../core/loader';
import { buttonThemeContent, buttonPresetContent, buttonClickSound, buttonTheme } from '../main';
import { validThemes, validPresets, clickSoundActive, setClickSound, activeCards } from '../state';


// Theme Button

export function initButtonTheme() {
    validThemes.forEach((label, key) => {

        const anchor = document.createElement('a');

        anchor.href = `#${key}`;
        anchor.textContent = label;
        anchor.className = 'theme-content-anchor';

        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            setThemeButtonName(label);
            document.documentElement.setAttribute('data-color-theme', key);
            toggleDropdown();
        });

        buttonThemeContent.appendChild(anchor);
    });
} export function initButtonPreset() {
    validPresets.forEach((label, key) => {
        const anchor = document.createElement('a');

        anchor.href = `#${key}`;
        anchor.textContent = label;
        anchor.className = 'preset-content-anchor';

        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            checkPreset(key);
            togglePresetDropdown();
        });

        buttonPresetContent.appendChild(anchor);
    });
}
export function toggleDropdown() {
    if (buttonThemeContent.style.display === 'flex') {
        buttonThemeContent.style.display = 'none';
    } else {
        buttonThemeContent.style.display = 'flex';
    }
}
export function togglePresetDropdown() {
    if (buttonPresetContent.style.display === 'flex') {
        buttonPresetContent.style.display = 'none';
    } else {
        buttonPresetContent.style.display = 'flex';
    }
}
export function toggleClickSound() {
    if (clickSoundActive) {
        buttonClickSound.innerHTML = "Turn on click sound";
    } else {
        buttonClickSound.innerHTML = "Turn off click sound";
    }

    setClickSound(!clickSoundActive);
}
export function setThemeButtonName(val: string | null) {
    if (val === null) {
        buttonTheme.innerHTML = "This isn't working...?";
        return;
    }

    if (isValidKey(val)) {
        const result = validThemes.get(val);
        buttonTheme.innerHTML = result;
    }
}

export function isValidKey(key: string): boolean {
    return validThemes.has(key);
}
export function checkPreset(preset: string) {
    activeCards.forEach((c) => {
        removeCard(c.div);
    });

    loadPreset(preset);
}
