import { canvas, canvasBackground, canvasX, canvasY, createCard, getCard, inTransition, isInActiveCards, isPanning, playSound, setCanvasX, setCanvasY, setPanning, setStartX, setStartY, setTransition, startX, startY } from './main';
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

    if (isInActiveCards(pageName)) {
      const existingCard = getCard(pageName)
      if (existingCard === null) return
      playSound()
      goToCard(existingCard)
      return
    }

    const currentLeft = parseInt(card.style.left || '0')
    const currentTop = parseInt(card.style.top || '0')
    const cardWidth = card.offsetWidth
    playSound()
    createCard(pageName, currentLeft + cardWidth + 40, currentTop, false)
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
    if (inTransition) return
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
    if (inTransition) return
    e.preventDefault()
    const { x, y } = getClient(e)
    card.div.style.left = (x - cardStartX) + 'px'
    card.div.style.top  = (y - cardStartY) + 'px'
  }

  function onEnd() {
    if (inTransition) return
    if (!isDragging) return
    isDragging = false
    card.div.style.cursor = 'grab'
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
    if (inTransition) return
    setPanning(true)
    const { x, y } = getClient(e)
    setStartX(x - canvasX)
    setStartY(y - canvasY)
    canvasBackground.style.cursor = 'grabbing'
  }

  function onMove(e: MouseEvent | TouchEvent) {
    if (!isPanning) return
    if (inTransition) return
    const { x, y } = getClient(e)
    setCanvasX(x - startX)
    setCanvasY(y - startY)
    canvas.style.transform = `translate(${canvasX}px, ${canvasY}px)`
    canvasBackground.style.backgroundPosition = `${canvasX % 30}px ${canvasY % 30}px`
  }

  function onEnd() {
    if (inTransition) return
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

export function centerCanvas() {
  if (canvasX == 0 && canvasY == 0) return
  canvas.style.transition = 'transform 0.8s ease'
  canvasBackground.style.transition = 'background-position 0.8s ease'

  setCanvasX(0)
  setCanvasY(0)
  canvas.style.transform = 'translate(0px, 0px)'
  canvasBackground.style.backgroundPosition = '0px 0px'
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