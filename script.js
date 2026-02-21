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

cargarVariosArchivos();

// base
createCard('start');

async function createCard(baseField) {
    const text = await fetch("/cards/" + baseField + ".md").then(r => r.text());
    var div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = marked.parse(text);
    div.style.left = '600px';
    div.style.top = '300px';
    canvas.appendChild(div);
    makeCardDraggable(div);
}

// MOVER EL CANVAS (pan)
canvasBackground.addEventListener('mousedown', (e) => {
    // Solo si NO estamos sobre una card
    if (e.target.closest('.card')) return;
    
    isPanning = true;
    startX = e.clientX - canvasX;
    startY = e.clientY - canvasY;
    canvasBackground.style.cursor = 'grabbing';
});

async function cargarVariosArchivos() {
  const archivos = [
    '/cards/start.md',
  ];
  
  const promesas = archivos.map(ruta => 
    fetch(ruta).then(r => r.text())
  );
  
  const contenidos = await Promise.all(promesas);
  contenidos.forEach((contenido, index) => {
    console.log(`Archivo ${archivos[index]}:`, contenido);
  });
}

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

// Función para hacer las cards arrastrables
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