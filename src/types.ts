export interface Card {
  id: string
  left: number
  top: number
  content: string
  frontmatter: Record<string, string>
}
// =======================================================================================
// WELCOME TO THIS WEBSITE CODE
// =======================================================================================
// --------------------------
// Types
// --------------------------
export interface SpawnedFrom {
  left: number
  top: number
  width: number
  height: number
}
export type Frontmatter = Record<string, string>

