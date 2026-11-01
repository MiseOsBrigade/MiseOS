import { renderGrid } from '../src/render.js';
document.getElementById('app').textContent = JSON.stringify(renderGrid('circuit'), null, 2);
