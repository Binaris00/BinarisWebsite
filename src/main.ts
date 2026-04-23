import { SpawnedFrom } from './types'
import { extractFrontmatter, getCardType, parseMarkdown, removeFrontmatter, setExtraClasses } from './makdown_utils'
import { addCanvasEventsListeners, addInternalLinkListeners, makeCardDraggable } from './event_listeners'
import moment from 'moment'

// DOM

export const canvas = document.getElementById('canvas') as HTMLElement
export const canvasBackground = document.getElementById('canvas-background-effect') as HTMLElement
const buttonDelete = document.getElementById('button-delete-mode') as HTMLButtonElement

// State

export let isPanning = false
export let startX = 0
export let startY = 0
export let canvasX = 0
export let canvasY = 0
export let deleteMode = false

export const activeCards = new Set<string>()

// Init

const centerX = Math.round(
  canvas.getBoundingClientRect().left +
  document.documentElement.scrollLeft +
  canvas.clientWidth / 2
)
const centerY = Math.round(
  canvas.getBoundingClientRect().top +
  document.documentElement.scrollTop +
  canvas.clientHeight / 2
)

createCard('start', 500, 120)
createCard('presentation', centerX, centerY)
createCard('gifs/cat', 421, 234)

document.title = 'new Binaris(' + moment().format('DcMtYYYY') + ')';

addCanvasEventsListeners()

/**
 * Create a draggable card that will be added in the given position
 * @param baseField - name of the .md file (without extension)
 * @param left - horizontal position in px
 * @param top - vertical position in px
 * @param spawnedFrom - position/size of the parent card (optional)
 */
export async function createCard(
  baseField: string,
  left: number,
  top: number,
  spawnedFrom: SpawnedFrom | null = null
): Promise<void> {
  if (activeCards.has(baseField)) return
  activeCards.add(baseField)

  let text = await fetch('/cards/' + baseField + '.md').then(r => r.text())
  const frontmatter = extractFrontmatter(text)

  const div = document.createElement('div')
  div.className = getCardType(frontmatter) + setExtraClasses(frontmatter)
  div.dataset.cardName = baseField
  text = removeFrontmatter(text)
  div.innerHTML = parseMarkdown(text)
  div.style.left = left + 'px'
  div.style.top = top + 'px'

  if (left === centerX && top === centerY) {
    div.style.transform = 'translate(-50%, -50%)'
  }

  canvas.appendChild(div)
  makeCardDraggable(div)
  addInternalLinkListeners(div)
}

function toggleDeleteMode(): void {
  deleteMode = !deleteMode
  buttonDelete.innerHTML = deleteMode ? 'Normal Mode' : 'Delete Mode'
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

buttonDelete.addEventListener('click', toggleDeleteMode)