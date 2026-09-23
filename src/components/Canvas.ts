// =========================================================================================
// General logic that interacts and modify the Canvas type as a whole, for example, changing its location, 
// being a lot of "outside" events that do this we have this component for handling it
//
// This is done outside the effect because of that, these aren't 'common' use methods inside the types
// they modify the same
// =========================================================================================

import { canvas, canvasBackground } from '../dom'
import {
    activeCards,
    centerX,
    centerY,
    canvasX,
    canvasY,
    dragOffsetX,
    dragOffsetY,
    draggingCard,
    isInTransition,
    isPanning,
    panStartX,
    panStartY,
    setCanvasX,
    setCanvasY,
    setDragOffsetX,
    setDragOffsetY,
    setDraggingCard,
    setPanning,
    setPanStartX,
    setPanStartY,
    setTransition,
} from '../state'
import type { Card } from '../types'

const BACKGROUND_PARALLAX = 0.5

function applyCanvasTransform(x: number, y: number): void {
    canvas.style.transform = `translate(${x}px, ${y}px)`
    canvasBackground.style.backgroundPosition = `${x * BACKGROUND_PARALLAX}px ${y * BACKGROUND_PARALLAX}px`
}

function getClient(e: MouseEvent | TouchEvent): { x: number; y: number } {
    return e instanceof TouchEvent ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY }
}

function onPointerDown(e: MouseEvent | TouchEvent): void {
    if (isInTransition) return

    const target = e.target as HTMLElement
    const cardDiv = target.closest<HTMLElement>('[data-card-name]')

    if (cardDiv) {
        if (target.closest('a')) return
        const card = activeCards.get(cardDiv.dataset.cardName ?? '')
        if (!card) return

        const { x, y } = getClient(e)
        setDraggingCard(card)
        setDragOffsetX(x - card.x)
        setDragOffsetY(y - card.y)
        cardDiv.style.cursor = 'grabbing'
        return
    }

    const { x, y } = getClient(e)
    setPanning(true)
    setPanStartX(x - canvasX)
    setPanStartY(y - canvasY)
    canvasBackground.style.cursor = 'grabbing'
}

function updateDebugLabel(card: Card): void {
    const label = card.div.querySelector('.debug-label')
    if (label) label.textContent = `${card.x - centerX}, ${card.y - centerY}`
}

function onPointerMove(e: MouseEvent | TouchEvent): void {
    if (isInTransition) return

    const { x, y } = getClient(e)

    if (draggingCard) {
        e.preventDefault()
        draggingCard.setPosition(x - dragOffsetX, y - dragOffsetY)
        updateDebugLabel(draggingCard)
        return
    }

    if (!isPanning) return
    setCanvasX(x - panStartX)
    setCanvasY(y - panStartY)
    canvas.style.transform = `translate(${canvasX}px, ${canvasY}px)`
    canvasBackground.style.backgroundPosition = `${canvasX % 30}px ${canvasY % 30}px`
}

function onPointerUp(): void {
    if (isInTransition) return

    if (draggingCard) {
        draggingCard.div.style.cursor = 'grab'
        setDraggingCard(null)
    }

    if (isPanning) {
        canvasBackground.style.cursor = 'grab'
        setPanning(false)
    }
}

export function initDragController(): void {
    canvasBackground.addEventListener('mousedown', onPointerDown)
    canvasBackground.addEventListener('touchstart', onPointerDown, { passive: false })
    document.addEventListener('mousemove', onPointerMove)
    document.addEventListener('touchmove', onPointerMove, { passive: false })
    document.addEventListener('mouseup', onPointerUp)
    document.addEventListener('touchend', onPointerUp)
}

export function centerCanvas(): void {
    if (canvasX == 0 && canvasY == 0) return
    canvas.style.transition = 'transform 0.8s ease'
    canvasBackground.style.transition = 'background-position 0.8s ease'

    setCanvasX(0)
    setCanvasY(0)
    applyCanvasTransform(0, 0)
    setTransition(true)

    const cleanup = () => {
        canvas.style.transition = ''
        canvasBackground.style.transition = ''
        canvas.removeEventListener('transitionend', cleanup)
        setTransition(false)
    }
    canvas.addEventListener('transitionend', cleanup)
}

export function goToCard(card: Card): void {
    setTransition(true)
    const cardRect = card.div.getBoundingClientRect()
    const viewportRect = canvasBackground.getBoundingClientRect()

    const cardCenterX = cardRect.left + cardRect.width / 2
    const cardCenterY = cardRect.top + cardRect.height / 2
    const viewportCenterX = viewportRect.left + viewportRect.width / 2
    const viewportCenterY = viewportRect.top + viewportRect.height / 2

    const deltaX = viewportCenterX - cardCenterX
    const deltaY = viewportCenterY - cardCenterY

    const newCanvasX = canvasX + deltaX
    const newCanvasY = canvasY + deltaY

    canvas.style.transition = 'transform 0.6s ease'
    canvasBackground.style.transition = 'background-position 0.6s ease'

    setCanvasX(newCanvasX)
    setCanvasY(newCanvasY)
    canvas.style.transform = `translate(${newCanvasX}px, ${newCanvasY}px)`
    canvasBackground.style.backgroundPosition = `${newCanvasX % 30}px ${newCanvasY % 30}px`

    const cleanup = () => {
        canvas.style.transition = ''
        canvasBackground.style.transition = ''
        canvas.removeEventListener('transitionend', cleanup)
        setTransition(false)
    }
    canvas.addEventListener('transitionend', cleanup)
}