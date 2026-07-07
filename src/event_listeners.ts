import { canvas, canvasBackground, canvasX, canvasY, createCard, deleteMode, isPanning, playSound, setCanvasX, setCanvasY, setPanning, setStartX, setStartY, startX, startY } from './main';
import { removeCard } from './makdown_utils';
import { Card } from './types';


// --------------------------
// Event listeners — cards
// --------------------------
/**
 * When an [[internal link]] is clicked, spawn a new card to the right.
 */
export function addInternalLinkListeners(card: HTMLElement): void {
    card.addEventListener('click', (e) => {
        const link = (e.target as HTMLElement).closest('a.internal-link') as HTMLAnchorElement | null
        if (!link) return
        e.preventDefault()

        const pageName = decodeURIComponent(link.dataset.page ?? '')
        const currentLeft = parseInt(card.style.left || '0')
        const currentTop = parseInt(card.style.top || '0')
        const cardWidth = card.offsetWidth
        playSound()
        createCard(pageName, currentLeft + cardWidth + 40, currentTop, false, false)
    })
} 

export function makeCardDraggable(card: Card): void {
  let isDragging = false
  let cardStartX = 0
  let cardStartY = 0

  function getClient(e: MouseEvent | TouchEvent) {
    return e instanceof TouchEvent
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY }
  }

  function onStart(e: MouseEvent | TouchEvent) {
    if ((e.target as HTMLElement).closest('a')) return
    e.stopPropagation()
    isDragging = true
    card.div.style.cursor = 'grabbing'
    const { x, y } = getClient(e)
    cardStartX = x - parseInt(card.div.style.left || '0')
    cardStartY = y - parseInt(card.div.style.top || '0')
  }

  function onMove(e: MouseEvent | TouchEvent) {
    if (!isDragging) return
    if (deleteMode && !card.protec) { card.div.remove(); return }
    e.preventDefault()
    const { x, y } = getClient(e)
    card.div.style.left = (x - cardStartX) + 'px'
    card.div.style.top  = (y - cardStartY) + 'px'
  }

  function onEnd() {
    if (!isDragging) return
    isDragging = false
    card.div.style.cursor = 'grab'
    if (deleteMode && !card.protec) removeCard(card.div)
  }

  card.div.addEventListener('mousedown', onStart)
  card.div.addEventListener('touchstart', onStart, { passive: false })
  document.addEventListener('mousemove', onMove)
  document.addEventListener('touchmove', onMove, { passive: false })
  document.addEventListener('mouseup', onEnd)
  document.addEventListener('touchend', onEnd)
}
// --------------------------
// Event listeners — canvas
// --------------------------
export function addCanvasEventsListeners() {
  function getClient(e: MouseEvent | TouchEvent) {
    return e instanceof TouchEvent
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY }
  }

  function onStart(e: MouseEvent | TouchEvent) {
    if ((e.target as HTMLElement).closest('.card')) return
    setPanning(true)
    const { x, y } = getClient(e)
    setStartX(x - canvasX)
    setStartY(y - canvasY)
    canvasBackground.style.cursor = 'grabbing'
  }

  function onMove(e: MouseEvent | TouchEvent) {
    if (!isPanning) return
    const { x, y } = getClient(e)
    setCanvasX(x - startX)
    setCanvasY(y - startY)
    canvas.style.transform = `translate(${canvasX}px, ${canvasY}px)`
    canvasBackground.style.backgroundPosition = `${canvasX % 30}px ${canvasY % 30}px`
  }

  function onEnd() {
    setPanning(false)
    canvasBackground.style.cursor = 'grab'
  }

  canvasBackground.addEventListener('mousedown', onStart)
  canvasBackground.addEventListener('touchstart', onStart, { passive: false })
  document.addEventListener('mousemove', onMove)
  document.addEventListener('touchmove', onMove, { passive: false })
  document.addEventListener('mouseup', onEnd)
  document.addEventListener('touchend', onEnd)
}