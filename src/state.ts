import { Card } from './types'

export const canvas = document.getElementById('canvas') as HTMLElement
export const canvasBackground = document.getElementById('canvas-background-effect') as HTMLElement

export let isPanning = false
export let startX = 0
export let startY = 0
export let canvasX = 0
export let canvasY = 0

export function setPanning(val: boolean) {
  isPanning = val
}

export function setStartX(x: number) {
  startX = x
}

export function setStartY(y: number) {
  startY = y
}

export function setCanvasX(x: number) {
  canvasX = x
}

export function setCanvasY(y: number) {
  canvasY = y
}

export let deleteMode = false

export function setDeleteMode(val: boolean) {
  deleteMode = val
}

export let clickSoundActive = true

export function setClickSound(val: boolean) {
  clickSoundActive = val
}

export const activeCards = new Set<Card>()

export const centerX = Math.round(canvas.getBoundingClientRect().left + document.documentElement.scrollLeft + canvas.clientWidth / 2)
export const centerY = Math.round(canvas.getBoundingClientRect().top + document.documentElement.scrollTop + canvas.clientHeight / 2)

export const validThemes = new Map<string, string>([
  ["neobrutalism", "Neobrutalism"],
  ["index-cards", "Index Cards"]
])

export const validPresets = new Map<string, string>([
  ["main", "main"],
  ["work", "work"],
  ["cats_gifts", "cats_gifts"],
  ["links", "links"]
])
