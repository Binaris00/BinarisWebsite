import { deleteMode, buttonDelete, setDeleteMode, buttonTheme, validThemes, buttonThemeContent } from './main';


export function toggleDeleteMode() {
    setDeleteMode(!deleteMode)
    buttonDelete.innerHTML = deleteMode ? 'Normal Mode' : 'Delete Mode'
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
    console.log("preset")
    if (buttonThemeContent.style.display === 'flex') {
        buttonThemeContent.style.display = 'none'
    } else {
        buttonThemeContent.style.display = 'flex'
    }
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

