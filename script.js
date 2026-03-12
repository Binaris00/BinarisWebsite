// =======================================================================================
// WELCOME TO THIS WEBSITE CODE
// I don't really have a lot of experience working with js, so this is some trash code from
// all the web. So I tried my best to make a lot of comments to understand this code for the future
// =======================================================================================

// Base vars
cards = []
const canvas = document.getElementById('canvas');
const canvasBackground = document.getElementById('canvas-background-effect');
let isPanning = false;
let startX, startY;
let canvasX = 0, canvasY = 0;

const activeCards = new Set();

// base card (atm just the test init card)
createCard('start', 300, 300);

/**
 * Create a draggable card that will be added in the given position
 * @param {String} baseField - name of the .md file (without extension)
 * @param {int} left - horizontal position in px
 * @param {int} top - vertical position in px
 * @param {Object|null} spawnedFrom - { left, top, width, height } of the parent card (optional)
 */
async function createCard(baseField, left, top, spawnedFrom = null) {
    if (activeCards.has(baseField)) return; // Don't open the same card twice
    activeCards.add(baseField);

    let text = await fetch("/cards/" + baseField + ".md").then(r => r.text());
    let frontmatter = extractFrontmatter(text);
    var div = document.createElement('div');
    div.className = getCardType(frontmatter) + setExtraClasses(frontmatter);
    div.dataset.cardName = baseField;
    text = removeFrontmatter(text);
    div.innerHTML = parseMarkdown(text);
    div.style.left = left + 'px';
    div.style.top = top + 'px';

    canvas.appendChild(div);
    makeCardDraggable(div);
    addInternalLinkListeners(div);
}






// --------------------------
// Load markdown
//--------------------------
/**
 * Parses markdown text and converts [[internal links]] into clickable anchors.
 * Example: [[my page]] becomes <a class="internal-link" data-page="my page">my page</a>
 * @param {String} text - raw markdown content
 * @returns {String} - HTML string with internal links ready
 */
function parseMarkdown(text) {
    // Replace [[page]] or [[page|display name]] with a markdown link using a special prefix
    const withLinks = text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, page, display) => {
        const label = display || page; // use display name if provided
        return `[${label}](internal:${encodeURIComponent(page)})`;
    });

    let html = marked.parse(withLinks);

    // Replace the internal: href with a data attribute so we can intercept clicks
    html = html.replace(
        /href="internal:([^"]+)"/g,
        'href="#" data-page="$1" class="internal-link"'
    );

    return html;
}







// --------------------------
// Load frontmatter
// --------------------------

// https://dev.to/codingnninja/how-to-extract-title-description-or-metadata-from-markdown-3nn8
const extractFrontmatter = (markdown) => {
    const charactersBetweenGroupedHyphens = /^---([\s\S]*?)---/;
    const metadataMatched = markdown.match(charactersBetweenGroupedHyphens);
    if (metadataMatched == null) {
        return {};
    }
    const metadata = metadataMatched[1];

    if (!metadata) {
        return {};
    }

    const metadataLines = metadata.split("\n");
    const metadataObject = metadataLines.reduce((accumulator, line) => {
        const [key, ...value] = line.split(":").map((part) => part.trim());

        if (key)
            accumulator[key] = value[1] ? value.join(":") : value.join("");
        return accumulator;
    }, {});
    return metadataObject;
};

/**
 * Removes the frontmatter part from the document. Wao
 * @param {String} text 
 * @returns card text without frontmatter
 */
function removeFrontmatter(text) {
    return text.replace(/^---[\s\S]*?---\s*/, '');
}

function getCardType(frontmatter) {
    if (!isValidFrontmatter(frontmatter, 'type')) {
        return 'card'
    }

    const value = frontmatter.type;
    if (value == 'gif') {
        console.log('congratulations, you found a gif, sadly, this isnt supported at the moment')
        return 'card'
    }
    return value;
}

function setExtraClasses(frontmatter) {
    let extras = ''
    extras += setBorderColor(frontmatter);
    return extras;
}

function setBorderColor(frontmatter) {
    if (!isValidFrontmatter(frontmatter, 'border-color')) {
        return ''
    }

    return ' card-border-' + frontmatter['border-color'];

}

function isValidFrontmatter(frontmatter, key) {
    if (!frontmatter) {
        return false;
    }

    if (Object.keys(frontmatter).length === 0) {
        return false;
    }

    if (!(key in frontmatter)) {
        return false;
    }
    
    return true;
}







// --------------------------
// Event listeners
// --------------------------

/**
 * Add click listeners to all [[internal links]] inside a card.
 * When clicked, a new card spawns to the right of the current one.
 * @param {HTMLElement} card
 */
function addInternalLinkListeners(card) {
    card.addEventListener('click', (e) => {
        const link = e.target.closest('a.internal-link');
        if (!link) return;
        e.preventDefault();

        const pageName = decodeURIComponent(link.dataset.page);

        // Calculate spawn position: to the right of the current card
        const currentLeft = parseInt(card.style.left || 0);
        const currentTop = parseInt(card.style.top || 0);
        const cardWidth = card.offsetWidth;

        const newLeft = currentLeft + cardWidth + 40;
        const newTop = currentTop + Math.random() * 40 - 20;

        createCard(pageName, newLeft, newTop, {
            left: currentLeft,
            top: currentTop,
            width: cardWidth,
            height: card.offsetHeight,
        });
    });
}

/**
 * Add the needed event listeners to make the card draggable
 * @param {Card} card 
 */
function makeCardDraggable(card) {
    let isDragging = false;
    let cardStartX, cardStartY;

    card.addEventListener('mousedown', (e) => {
        // Don't start drag when clicking a link
        if (e.target.closest('a')) return;

        e.stopPropagation(); // Evita que active el pan del canvas
        isDragging = true;
        card.style.cursor = 'grabbing';

        cardStartX = e.clientX - parseInt(card.style.left || 0);
        cardStartY = e.clientY - parseInt(card.style.top || 0);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        e.preventDefault();
        card.style.left = (e.clientX - cardStartX) + 'px';
        card.style.top = (e.clientY - cardStartY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            card.style.cursor = 'grab';
        }
    });
}

canvasBackground.addEventListener('mousedown', (e) => {
    if (e.target.closest('.card')) return;

    isPanning = true;
    startX = e.clientX - canvasX;
    startY = e.clientY - canvasY;
    canvasBackground.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isPanning) return;

    canvasX = e.clientX - startX;
    canvasY = e.clientY - startY;
    canvas.style.transform = `translate(${canvasX}px, ${canvasY}px)`;

    canvasBackground.style.backgroundPosition = `${canvasX % 30}px ${canvasY % 30}px`;
});

document.addEventListener('mouseup', () => {
    isPanning = false;
    canvasBackground.style.cursor = 'grab';
});