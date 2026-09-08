import { Card } from './types'
import { canvas } from './dom'

export const activeCards = new Map<string, Card>()

export const centerX = Math.round(
  canvas.getBoundingClientRect().left + document.documentElement.scrollLeft + canvas.clientWidth / 2,
)
export const centerY = Math.round(
  canvas.getBoundingClientRect().top + document.documentElement.scrollTop + canvas.clientHeight / 2,
)

export let isInTransition = false

export function setTransition(val: boolean): void {
  isInTransition = val
}

export let clickSoundActive = true

export function setClickSound(val: boolean): void {
  clickSoundActive = val
}

export let isPanning = false
export let panStartX = 0
export let panStartY = 0
export let canvasX = 0
export let canvasY = 0

export function setPanning(val: boolean): void {
  isPanning = val
}

export function setPanStartX(x: number): void {
  panStartX = x
}

export function setPanStartY(y: number): void {
  panStartY = y
}

export function setCanvasX(x: number): void {
  canvasX = x
}

export function setCanvasY(y: number): void {
  canvasY = y
}

export let draggingCard: Card | null = null
export let dragOffsetX = 0
export let dragOffsetY = 0

export function setDraggingCard(card: Card | null): void {
  draggingCard = card
}

export function setDragOffsetX(x: number): void {
  dragOffsetX = x
}

export function setDragOffsetY(y: number): void {
  dragOffsetY = y
}
