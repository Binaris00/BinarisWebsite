/// <reference types="vite/client" />

import { Card } from './types'
import { extractFrontmatter, getCardType, parseMarkdown, removeFrontmatter, setExtraClasses } from './makdown_utils'
import { addCanvasEventsListeners, addInternalLinkListeners, makeCardDraggable } from './event_listeners'
import moment from 'moment'
import { safetlyCheckPreset } from './preset_utils'
import { initButtonPreset, initButtonTheme, setThemeButtonName, toggleClickSound, toggleDropdown, togglePresetDropdown } from './button_utils'

// DOM

export const canvas = document.getElementById('canvas') as HTMLElement
export const canvasBackground = document.getElementById('canvas-background-effect') as HTMLElement
export const buttonTheme = document.getElementById('button-themes') as HTMLButtonElement
export const buttonThemeContent = document.getElementById('themes-content') as HTMLElement
export const buttonClickSound = document.getElementById('button-click-sound') as HTMLElement
export const buttonPreset = document.getElementById('button-preset') as HTMLElement
export const buttonPresetContent = document.getElementById('presets-content') as HTMLElement

// State

export let isPanning = false
export let startX = 0
export let startY = 0
export let canvasX = 0
export let canvasY = 0
export let clickSoundActive = true
export let isDebug = false
export const activeCards = new Set<Card>()

// Init

export const centerX = Math.round(canvas.getBoundingClientRect().left + document.documentElement.scrollLeft + canvas.clientWidth / 2)
export const centerY = Math.round(canvas.getBoundingClientRect().top + document.documentElement.scrollTop + canvas.clientHeight / 2)
export const validPresets = [ "main", "work", "cats_gifts", "links"]
const clickSound = new Audio('https://files.catbox.moe/yp5pf1.wav');

export const validThemes = {
  "neobrutalism": "Neobrutalism",
  "index-cards": "Index Cards"
}

const preset = window.location.hash.substring(1)
safetlyCheckPreset(preset);

document.title = 'new Binaris(' + moment().format('DcMtYYYY') + ')';

setThemeButtonName(document.documentElement.getAttribute('data-color-theme'))

addCanvasEventsListeners()

initButtonTheme()
initButtonPreset()

const cardFiles = import.meta.glob('/cards/**/*.md', { query: '?raw', import: 'default' });
const availableCards = Object.keys(cardFiles).map(path => path.replace('/cards/', '').replace('.md', ''));

/**
 * Create a draggable card that will be added in the given position
 * @param baseField - name of the .md file (without extension)
 * @param left - horizontal position in px
 * @param top - vertical position in px
 * @param centerFix - the cards that are spawned by links doesn't need the center fix
 */
export async function createCard(baseField: string, left: number, top: number, centerFix: boolean): Promise<void> {
  if (isInActiveCards(baseField)) return

  const matchedPath = availableCards.find(path => path === baseField || path.endsWith('/' + baseField));
  let text = "";

  if (!matchedPath) {
    console.warn(`Couldn't find "${baseField}" in /cards/`);
    text = await fetch('/cards/error.md').then(r => r.text())
  } else {
    text = await fetch('/cards/' + matchedPath + '.md').then(r => r.text())
  }

  const frontmatter = extractFrontmatter(text)

  const div = document.createElement('div')
  div.className = getCardType(frontmatter) + setExtraClasses(frontmatter)
  div.dataset.cardName = baseField
  text = removeFrontmatter(text)
  div.innerHTML = parseMarkdown(text)

  if (left === centerX && top === centerY) {
    div.style.left = left + 'px'
    div.style.top = top + 'px'
    div.style.transform = 'translate(-50%, -50%)'
  } else if (centerFix){
    div.style.left = (left + centerX) + 'px'
    div.style.top = (top + centerY) + 'px'
  } else {
    div.style.left = left + 'px'
    div.style.top = top + 'px'
  }

  if (isDebug) {
    const debugLabel = document.createElement('div')
    debugLabel.className = 'debug-label'
    debugLabel.textContent = `${left}, ${top}`
    div.appendChild(debugLabel)
  }

  const cardF = new Card(baseField, left, top, text, frontmatter, div)
  activeCards.add(cardF)
  canvas.appendChild(div)
  makeCardDraggable(cardF)
  addInternalLinkListeners(div)
}

export function setCanvasX(x: number) {
  canvasX = x
}

export function setCanvasY(y: number) {
  canvasY = y
}

export function setStartX(x: number) {
  startX = x
}

export function setStartY(y: number) {
  startY = y
}

export function setPanning(val: boolean) {
  isPanning = val
}

export function setClickSound(val: boolean) {
  clickSoundActive = val
}

export function isInActiveCards(val: string): boolean {
  for (var card of activeCards) {
    if (card.id === val) return true;
  }

  return false;
}

export function getCard(val: string): Card | null {
  for (var card of activeCards) {
    if (card.id === val) return card;
  }

  return null;
}

export function playSound() {
  if (!clickSoundActive) return
  clickSound.currentTime = 0;
  clickSound.play();
}

buttonTheme.addEventListener('click', toggleDropdown)
buttonPreset.addEventListener('click', togglePresetDropdown)
buttonClickSound.addEventListener('click', toggleClickSound)