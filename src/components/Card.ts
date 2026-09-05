import { isInActiveCards, getCard, createCard } from '../core/canvas';
import { goToCard } from './Canvas';
import { inTransition, playSound } from '../main';
import { Card } from '../types';


export function makeCardDraggable(card: Card): void {
    let isDragging = false;
    let cardStartX = 0;
    let cardStartY = 0;

    function getClient(e: MouseEvent | TouchEvent) {
        return e instanceof TouchEvent
            ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
            : { x: e.clientX, y: e.clientY };
    }

    function onStart(e: MouseEvent | TouchEvent) {
        if (inTransition) return;
        if ((e.target as HTMLElement).closest('a')) return;
        e.stopPropagation();
        isDragging = true;
        card.div.style.cursor = 'grabbing';
        const { x, y } = getClient(e);
        cardStartX = x - parseInt(card.div.style.left || '0');
        cardStartY = y - parseInt(card.div.style.top || '0');
    }

    function onMove(e: MouseEvent | TouchEvent) {
        if (!isDragging) return;
        if (inTransition) return;
        e.preventDefault();
        const { x, y } = getClient(e);
        card.div.style.left = (x - cardStartX) + 'px';
        card.div.style.top = (y - cardStartY) + 'px';
    }

    function onEnd() {
        if (inTransition) return;
        if (!isDragging) return;
        isDragging = false;
        card.div.style.cursor = 'grab';
    }

    card.div.addEventListener('mousedown', onStart);
    card.div.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
}// --------------------------
// Event listeners — cards
// --------------------------
/**
 * When an [[internal link]] is clicked, spawn a new card to the right.
 */


export function addInternalLinkListeners(card: HTMLElement): void {
    card.addEventListener('click', (e) => {
        const link = (e.target as HTMLElement).closest('a.internal-link') as HTMLAnchorElement | null;
        if (!link) return;
        e.preventDefault();
        const pageName = decodeURIComponent(link.dataset.page ?? '');

        if (isInActiveCards(pageName)) {
            const existingCard = getCard(pageName);
            if (existingCard === null) return;
            playSound();
            goToCard(existingCard);
            return;
        }

        const currentLeft = parseInt(card.style.left || '0');
        const currentTop = parseInt(card.style.top || '0');
        const cardWidth = card.offsetWidth;
        playSound();
        createCard(pageName, currentLeft + cardWidth + 40, currentTop, false);
    });
}

