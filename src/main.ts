/// <reference types="vite/client" />

import { centerCanvas } from './components/Canvas'
import { addCanvasEventsListeners } from './components/Canvas'
import moment from 'moment'
import { safetlyCheckPreset } from './core/loader'
import { setThemeButtonName } from './components/Toolbar'
import { toggleClickSound } from './components/Toolbar'
import { togglePresetDropdown } from './components/Toolbar'
import { toggleDropdown } from './components/Toolbar'
import { initButtonPreset } from './components/Toolbar'
import { initButtonTheme } from './components/Toolbar'
import { clickSoundActive } from './state'

// DOM

export const buttonTheme = document.getElementById('button-themes') as HTMLButtonElement
export const buttonThemeContent = document.getElementById('themes-content') as HTMLElement
export const buttonClickSound = document.getElementById('button-click-sound') as HTMLElement
export const buttonPreset = document.getElementById('button-preset') as HTMLElement
export const buttonPresetContent = document.getElementById('presets-content') as HTMLElement
export const buttonCenter = document.getElementById('button-center') as HTMLButtonElement

// State

export let isDebug = false
export let inTransition = false

export function setTransition(val: boolean) {
  inTransition = val
}

// Init

const clickSound = new Audio('https://files.catbox.moe/yp5pf1.wav');

export function playSound() {
  if (!clickSoundActive) return
  clickSound.currentTime = 0;
  clickSound.play();
}

const preset = window.location.hash.substring(1)
safetlyCheckPreset(preset);

document.title = 'new Binaris(' + moment().format('DcMtYYYY') + ')';

setThemeButtonName(document.documentElement.getAttribute('data-color-theme'))

addCanvasEventsListeners()

initButtonTheme()
initButtonPreset()

const cardFiles = import.meta.glob('/cards/**/*.md', { query: '?raw', import: 'default' });
export const availableCards = Object.keys(cardFiles).map(path => path.replace('/cards/', '').replace('.md', ''));

buttonTheme.addEventListener('click', toggleDropdown)
buttonPreset.addEventListener('click', togglePresetDropdown)
buttonClickSound.addEventListener('click', toggleClickSound)
buttonCenter.addEventListener('click', centerCanvas)
