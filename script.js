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

// base card (atm just the test init card)
createCard('start', 300, 300);
createCard('electroblobs wizardry redux', 400, 300);

/**
 * Create a draggable card that will be added in the 600 - 300 of the screen
 * @param {String} baseField 
 * @param {int} left
 * @param {int} top
 */
async function createCard(baseField, left, top) {
    const text = await fetch("/cards/" + baseField + ".md").then(r => r.text());
    var div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = marked.parse(text);
    div.style.left = left + 'px';
    div.style.top = top + 'px';
    canvas.appendChild(div);
    makeCardDraggable(div);
}

/**
 * Add the needed event listeners to make the card draggable
 * @param {Card} card 
 */
function makeCardDraggable(card) {
    let isDragging = false;
    let cardStartX, cardStartY;
    
    card.addEventListener('mousedown', (e) => {
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

// Move all the canvas
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
