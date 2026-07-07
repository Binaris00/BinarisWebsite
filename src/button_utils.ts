import { buttonTheme, validThemes, buttonThemeContent, clickSoundActive, setClickSound, buttonClickSound, activeCards, buttonPresetContent, validPresets } from './main';
import { removeCard } from './makdown_utils';
import { loadPreset } from './preset_utils';

// Theme Button

export function initButtonTheme() {
    Object.entries(validThemes).forEach(([key, label]) => {

    const anchor = document.createElement('a');

    anchor.href = `#${key}`;
    anchor.textContent = label;
    anchor.className = 'theme-content-anchor'

    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        setThemeButtonName(label)
        document.documentElement.setAttribute('data-color-theme', key)
        toggleDropdown()
    });

    buttonThemeContent.appendChild(anchor);
    });
}

export function initButtonPreset() {
    validPresets.forEach((p) => {
        const anchor = document.createElement('a');

        anchor.href = `#${p}`;
        anchor.textContent = p;
        anchor.className = 'preset-content-anchor'

        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            checkPreset(p)
            togglePresetDropdown();
        });

        buttonPresetContent.appendChild(anchor);
    })
}

export function checkPreset(preset: string) {
    activeCards.forEach((c) => {
        removeCard(c.div)
    })

    loadPreset(preset)
}

export function toggleDropdown() {
    if (buttonThemeContent.style.display === 'flex') {
        buttonThemeContent.style.display = 'none'
    } else {
        buttonThemeContent.style.display = 'flex'
    }
}

export function togglePresetDropdown() {
    if (buttonPresetContent.style.display === 'flex') {
        buttonPresetContent.style.display = 'none'
    } else {
        buttonPresetContent.style.display = 'flex'
    }
}

export function toggleClickSound() {
    if (clickSoundActive) {
        buttonClickSound.innerHTML = "Turn on click sound"
    } else {
        buttonClickSound.innerHTML = "Turn off click sound"
    }
    
    setClickSound(!clickSoundActive)
}

export function setThemeButtonName(val: string | null) {
    if (val === null) {
        buttonTheme.innerHTML = "This isn't working...?"
        return
    }

    if (isValidKey(val)) {
        const result = validThemes[val] 
        buttonTheme.innerHTML = result
    }
}

function isValidKey(key: string): key is keyof typeof validThemes {
  return key in validThemes;
}

