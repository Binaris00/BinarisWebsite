import { deleteMode, buttonDelete, setDeleteMode, buttonTheme, validThemes, buttonThemeContent, clickSoundActive, setClickSound, buttonClickSound, activeCards } from './main';


export function toggleDeleteMode() {
    setDeleteMode(!deleteMode)
    buttonDelete.innerHTML = deleteMode ? 'Exit Delete Mode' : 'Enter Delete Mode'

    activeCards.forEach(c => {
     if (deleteMode) {
      c.div.classList.add('can-be-deleted')
    } else {
      c.div.classList.remove('can-be-deleted');
    }
    })
}

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

export function toggleDropdown() {
    if (buttonThemeContent.style.display === 'flex') {
        buttonThemeContent.style.display = 'none'
    } else {
        buttonThemeContent.style.display = 'flex'
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

