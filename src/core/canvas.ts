import { addInternalLinkListeners } from '../components/Card';
import { makeCardDraggable } from '../components/Card';
import { availableCards, isDebug } from '../main';
import { centerX, centerY, activeCards, canvas } from '../state';
import { Card } from '../types';
import { extractFrontmatter, getCardType, setExtraClasses, removeFrontmatter, parseMarkdown } from './parser';


/**
 * Create a draggable card that will be added in the given position
 * @param baseField - name of the .md file (without extension)
 * @param left - horizontal position in px
 * @param top - vertical position in px
 * @param centerFix - the cards that are spawned by links doesn't need the center fix
 */

export async function createCard(baseField: string, left: number, top: number, centerFix: boolean): Promise<void> {
    if (isInActiveCards(baseField)) return

    const matchedPath = availableCards.find(path => path === baseField || path.endsWith('/' + baseField))
    let text = ""

    if (!matchedPath) {
        console.warn(`Couldn't find "${baseField}" in /cards/`)
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
    } else if (centerFix) {
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
} export function removeCard(card: HTMLElement): void {
    const name = card.dataset.cardName;
    if (name && isInActiveCards(name)) {
        let card = getCard(name);
        if (card != null) {
            activeCards.delete(card);
        }
    }
    card.remove();
}
export function isInActiveCards(val: string): boolean {
    for (var card of activeCards) {
        if (card.id === val) return true
    }

    return false
}
export function getCard(val: string): Card | null {
    for (var card of activeCards) {
        if (card.id === val) return card
    }

    return null
}

