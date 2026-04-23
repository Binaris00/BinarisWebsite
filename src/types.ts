export interface Card {
  id: string
  left: number
  top: number
  content: string
  frontmatter: Record<string, string>
}

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

  constructor(id: string, left: number, top: number, content: string, frontmatter: Frontmatter) {
    this.id = id
    this.left = left
    this.top = top
    this.content = content
    this.frontmatter = frontmatter
  }
}