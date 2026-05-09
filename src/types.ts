export interface SpawnedFrom {
  left: number
  top: number
  width: number
  height: number
}

export type Frontmatter = Record<string, string>

export class Card {
  id: string;
  left: number;
  top: number;
  content: string;
  frontmatter: Frontmatter;
  div: HTMLElement;
  protec: boolean

  constructor(id: string, left: number, top: number, content: string, frontmatter: Frontmatter, div: HTMLElement, protec: boolean) {
    this.id = id
    this.left = left
    this.top = top
    this.content = content
    this.frontmatter = frontmatter
    this.div = div
    this.protec = protec
  }
}

export interface CardEntry {
  coords: [number, number]
  center: boolean
  random: boolean
  protected: boolean
}

export interface Preset {
  cards: Record<string, CardEntry>
  theme: string
}