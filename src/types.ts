export type Frontmatter = Record<string, string>

export type Anchor = 'top-left' | 'center'

export interface CardPosition {
  x: number
  y: number
  anchor?: Anchor
}

export type CardEntryMode = 'center' | 'offset' | 'absolute' | 'random'

export interface CardEntry {
  mode: CardEntryMode
  x?: number
  y?: number
}

export interface Preset {
  cards: Record<string, CardEntry>
  theme: string
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

export class Card {
  readonly id: string
  readonly div: HTMLElement
  readonly content: string
  readonly frontmatter: Frontmatter
  private _x: number
  private _y: number
  private readonly _anchor: Anchor

  constructor(id: string, content: string, frontmatter: Frontmatter, div: HTMLElement, position: CardPosition) {
    this.id = id
    this.content = content
    this.frontmatter = frontmatter
    this.div = div
    this._x = position.x
    this._y = position.y
    this._anchor = position.anchor ?? 'top-left'
  }

  get x(): number {
    return this._x
  }

  get y(): number {
    return this._y
  }

  get anchor(): Anchor {
    return this._anchor
  }

  setPosition(x: number, y: number): void {
    this._x = x
    this._y = y
    this.div.style.left = `${x}px`
    this.div.style.top = `${y}px`
  }

  render(): void {
    this.setPosition(this._x, this._y)
    if (this._anchor === 'center') {
      this.div.style.transform = 'translate(-50%, -50%)'
    }
  }
}
