import { marked } from 'marked';
import { Frontmatter } from '../types';


/**
 * Parses markdown text and converts [[internal links]] into clickable anchors.
 * Example: [[my page]] becomes <a class="internal-link" data-page="my page">my page</a>
 */

export function parseMarkdown(text: string): string {
    const withLinks = text.replace(
        /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
        (_, page: string, display?: string) => {
            const label = display ?? page;
            return `[${label}](internal:${encodeURIComponent(page)})`;
        }
    );

    let html = marked.parse(withLinks) as string;

    html = html.replace(
        /<img src="([^"]+)"/g,
        (match, src) => {
            if (src.startsWith('http')) return match;
            return `<img src="/cards/assets/imgs/${src}"`;
        }
    );

    html = html.replace(
        /href="internal:([^"]+)"/g,
        'href="#" data-page="$1" class="internal-link"'
    );

    return html;
} export function extractFrontmatter(markdown: string): Frontmatter {
    const match = markdown.match(/^---([\s\S]*?)---/);
    if (!match?.[1]) return {};

    return match[1]
        .split('\n')
        .reduce<Frontmatter>((acc, line) => {
            const [key, ...value] = line.split(':').map(p => p.trim());
            if (key) acc[key] = value.length > 1 ? value.join(':') : value.join('');
            return acc;
        }, {});
}
export function removeFrontmatter(text: string): string {
    return text.replace(/^---[\s\S]*?---\s*/, '');
}
export function isValidFrontmatter(frontmatter: Frontmatter, key: string): boolean {
    return (
        !!frontmatter &&
        Object.keys(frontmatter).length > 0 &&
        key in frontmatter
    );
}
export function getCardType(frontmatter: Frontmatter): string {
    if (!isValidFrontmatter(frontmatter, 'type')) return 'card';
    return frontmatter.type === 'gif' ? 'gif-card' : frontmatter.type;
}
export function setExtraClasses(frontmatter: Frontmatter): string {
    return setBorderColor(frontmatter) + setH1Display(frontmatter);
}
export function setBorderColor(frontmatter: Frontmatter): string {
    if (!isValidFrontmatter(frontmatter, 'card-color')) return '';
    return ' card-color-' + frontmatter['card-color'];
}
export function setH1Display(frontmatter: Frontmatter): string {
    if (!isValidFrontmatter(frontmatter, 'h1-display-lg')) return '';
    return ' h1-display-lg';
}

