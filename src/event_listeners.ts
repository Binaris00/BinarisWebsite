import { canvas, canvasBackground, canvasX, canvasY, centerX, centerY, createCard, deleteMode, isDebug, isPanning, playSound, setCanvasX, setCanvasY, setPanning, setStartX, setStartY, startX, startY } from './main';
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

        createCard(pageName, currentLeft + cardWidth + 40, currentTop, false, false)
    })
} export function makeCardDraggable(card: Card): void {
    let isDragging = false
    let cardStartX = 0
    let cardStartY = 0

    card.div.addEventListener('mousedown', (e) => {
        if ((e.target as HTMLElement).closest('a')) return

        e.stopPropagation()
        isDragging = true
        card.div.style.cursor = 'grabbing'
        cardStartX = e.clientX - parseInt(card.div.style.left || '0')
        cardStartY = e.clientY - parseInt(card.div.style.top || '0')
    })

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return
        if (deleteMode && !card.protec) { 
            card.div.remove(); 
            return 
        }
        const x = e.clientX - cardStartX
        const y = e.clientY - cardStartY

        

        e.preventDefault()
        card.div.style.left = (x) + 'px'
        card.div.style.top = (y) + 'px'

        if (isDebug) {
            const label = card.div.querySelector('.debug-label') as HTMLElement
            if (label) label.textContent = `${x - centerX}, ${y - centerY}`
        }
    })

    document.addEventListener('mouseup', () => {
        if (!isDragging) return
        isDragging = false
        card.div.style.cursor = 'grab'
        if (deleteMode && !card.protec) {
            removeCard(card.div)
        }
    })
}
// --------------------------
// Event listeners — canvas
// --------------------------
export function addCanvasEventsListeners() {
    canvasBackground.addEventListener('mousedown', (e) => {
        if ((e.target as HTMLElement).closest('.card')) return
        setPanning(true)
        setStartX(e.clientX - canvasX)
        setStartY(e.clientY - canvasY)
        canvasBackground.style.cursor = 'grabbing'
    })

    document.addEventListener('mousemove', (e) => {
        if (!isPanning) return
        setCanvasX(e.clientX - startX)
        setCanvasY(e.clientY - startY)
        canvas.style.transform = `translate(${canvasX}px, ${canvasY}px)`
        canvasBackground.style.backgroundPosition = `${canvasX % 30}px ${canvasY % 30}px`
    })

    document.addEventListener('mouseup', () => {
        setPanning(false)
        canvasBackground.style.cursor = 'grab'
    })
}