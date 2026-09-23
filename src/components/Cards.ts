/// <reference types="vite/client" />

// =========================================================================================
// These are the methods that interacts with cards as a content, creating them, checking the active 
// cards, looking at the frontmatter and some small changes
// =========================================================================================

import { playSound } from '../audio'
import { canvas, canvasBackground } from '../dom'
import { activeCards, centerX, centerY, isDebug } from '../state'
import { Card } from '../types'
import type { CardEntry, CardPosition } from '../types'
import { goToCard } from './Canvas'
import { extractFrontmatter, getCardType, parseMarkdown, removeFrontmatter, setExtraClasses } from '../core/parser'

const cardModules = import.meta.glob(['/cards/**/*.md', '!/cards/.trash/**'], {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

function resolveCardPath(name: string): string | null {
  const exact = `/cards/${name}.md`
  if (exact in cardModules) return exact
  return Object.keys(cardModules).find((path) => path.endsWith(`/${name}.md`)) ?? null
}

function getCardContent(name: string): string | null {
  const path = resolveCardPath(name)
  return path === null ? null : cardModules[path]
}

export function createCard(name: string, position: CardPosition): Card | null {
  if (isInActiveCards(name)) return null

  const content = getCardContent(name)
  let markdown: string
  if (content === null) {
    console.warn(`Couldn't find "${name}" in /cards/`)
    markdown = getCardContent('error') ?? ''
  } else {
    markdown = content
  }

  const frontmatter = extractFrontmatter(markdown)
  const body = removeFrontmatter(markdown)

  const div = document.createElement('div')
  div.className = getCardType(frontmatter) + setExtraClasses(frontmatter)
  div.dataset.cardName = name
  div.innerHTML = parseMarkdown(body)

  const card = new Card(name, body, frontmatter, div, position)
  activeCards.set(name, card)
  canvas.appendChild(div)
  card.render()

  if (isDebug) {
    const debugLabel = document.createElement('div')
    debugLabel.className = 'debug-label'
    debugLabel.textContent = `${card.x - centerX}, ${card.y - centerY}`
    div.appendChild(debugLabel)
  }

  return card
}

export function removeCard(card: Card | string): void {
  const target = typeof card === 'string' ? activeCards.get(card) : card
  if (!target) return
  activeCards.delete(target.id)
  target.div.remove()
}

export function isInActiveCards(name: string): boolean {
  return activeCards.has(name)
}

export function getCard(name: string): Card | null {
  return activeCards.get(name) ?? null
}

export function initInternalLinkListeners(): void {
  canvasBackground.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('a.internal-link') as HTMLAnchorElement | null
    if (!link) return
    e.preventDefault()

    const pageName = decodeURIComponent(link.dataset.page ?? '')

    if (isInActiveCards(pageName)) {
      const existingCard = getCard(pageName)
      if (!existingCard) return
      playSound()
      goToCard(existingCard)
      return
    }

    const sourceDiv = (e.target as HTMLElement).closest<HTMLElement>('[data-card-name]')
    const sourceCard = sourceDiv ? getCard(sourceDiv.dataset.cardName ?? '') : null
    const x = sourceCard ? sourceCard.x + sourceCard.div.offsetWidth + 40 : centerX
    const y = sourceCard ? sourceCard.y : centerY

    playSound()
    createCard(pageName, { x, y })
  })
} 

export function resolveCardEntry(entry: CardEntry, center: { x: number; y: number }): CardPosition {
  switch (entry.mode) {
    case 'center':
      return { x: center.x, y: center.y, anchor: 'center' }
    case 'offset':
      return { x: center.x + (entry.x ?? 0), y: center.y + (entry.y ?? 0) }
    case 'absolute':
      return { x: entry.x ?? 0, y: entry.y ?? 0 }
    case 'random':
      return {
        x: getRandomIntInclusive(-(entry.x ?? 0), entry.x ?? 0),
        y: getRandomIntInclusive(-(entry.y ?? 0), entry.y ?? 0),
      }
  }
}

export function getRandomIntInclusive(min: number, max: number): number {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}