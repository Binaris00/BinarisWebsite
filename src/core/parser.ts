import { marked, Renderer } from 'marked'
import type { Tokens } from 'marked'
import type { Frontmatter } from '../types'

// Gets raw data (like note content from Obsidian) and convert its to a format that the page can load, handles bad formatting and other unexpected cases

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => ESCAPES[char]!)
}

const renderer = new Renderer()
const defaultLink = renderer.link.bind(renderer)
const defaultImage = renderer.image.bind(renderer)

renderer.link = (token: Tokens.Link) => {
  if (token.href.startsWith('internal:')) {
    const page = decodeURIComponent(token.href.slice('internal:'.length))
    return `<a href="#" data-page="${encodeURIComponent(page)}" class="internal-link">${escapeHtml(token.text)}</a>`
  }
  return defaultLink(token)
}

renderer.image = (token: Tokens.Image) => {
  if (token.href.startsWith('http')) return defaultImage(token)
  return `<img src="/cards/assets/imgs/${token.href}" alt="${escapeHtml(token.text)}">`
}

export function parseMarkdown(text: string): string {
  const withLinks = text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, page: string, display?: string) => {
    const label = display ?? page
    return `[${label}](internal:${encodeURIComponent(page)})`
  })

  return marked.parse(withLinks, { renderer }) as string
}

export function extractFrontmatter(markdown: string): Frontmatter {
  const match = markdown.match(/^---([\s\S]*?)---/)
  if (!match?.[1]) return {}

  return match[1].split('\n').reduce<Frontmatter>((acc, line) => {
    const [key, ...value] = line.split(':').map((part) => part.trim())
    if (key) acc[key] = value.length > 1 ? value.join(':') : value.join('')
    return acc
  }, {})
}

export function removeFrontmatter(text: string): string {
  return text.replace(/^---[\s\S]*?---\s*/, '')
}

export function isValidFrontmatter(frontmatter: Frontmatter, key: string): boolean {
  return !!frontmatter && Object.keys(frontmatter).length > 0 && key in frontmatter
}

export function getCardType(frontmatter: Frontmatter): string {
  if (!isValidFrontmatter(frontmatter, 'type')) return 'card'
  return frontmatter.type === 'gif' ? 'gif-card' : frontmatter.type
}

export function setExtraClasses(frontmatter: Frontmatter): string {
  return setBorderColor(frontmatter) + setH1Display(frontmatter)
}

export function setBorderColor(frontmatter: Frontmatter): string {
  if (!isValidFrontmatter(frontmatter, 'card-color')) return ''
  return ' card-color-' + frontmatter['card-color']
}

export function setH1Display(frontmatter: Frontmatter): string {
  if (!isValidFrontmatter(frontmatter, 'h1-display-lg')) return ''
  return ' h1-display-lg'
}
