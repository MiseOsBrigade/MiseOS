const API_URL = 'http://localhost:3000';
const canvas = document.querySelector('#stage');
const ctx = canvas.getContext('2d');
const statusEl = document.querySelector('#status');
const output = document.querySelector('#output');
const connectButton = document.querySelector('#connect-wallet');

let manifest;
let image;
let session;

async function boot() {
  const saved = localStorage.getItem('miseos_session');
  if (saved) session = JSON.parse(saved);

  manifest = await fetch('/manifest/clickable-character.manifest.json').then(check).then(r => r.json());
  await fetch(`${API_URL}/api/manifest/verify`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ manifest })
  }).then(check);

  image = await loadImage(manifest.asset.pngPath);
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  redraw();

  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('click', onClick);
  connectButton.addEventListener('click', connectWallet);
  setStatus('Manifest verified. Visual asset is non-executable.');
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  for (const hotspot of manifest.hotspots) drawHotspot(hotspot);
}

function drawHotspot(hotspot) {
  ctx.save();
  ctx.strokeStyle = hotspot.requiresNft ? '#ff7b4d' : '#26e6b0';
  ctx.fillStyle = ctx.strokeStyle;
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  const s = hotspot.shape;
  if (s.type === 'circle') {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.stroke();
  } else if (s.type === 'rect') {
    ctx.strokeRect(s.x, s.y, s.w, s.h);
  } else {
    ctx.beginPath();
    s.points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.closePath();
    ctx.stroke();
  }
  ctx.font = '24px system-ui';
  ctx.fillText(hotspot.name, s.x ?? s.points[0][0], (s.y ?? s.points[0][1]) - 12);
  ctx.restore();
}

function coordinates(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width / rect.width,
    y: (event.clientY - rect.top) * canvas.height / rect.height
  };
}

function hitTest(point, hotspot) {
  const s = hotspot.shape;
  if (s.type === 'circle') return Math.hypot(point.x - s.x, point.y - s.y) <= s.r;
  if (s.type === 'rect') return point.x >= s.x && point.x <= s.x + s.w && point.y >= s.y && point.y <= s.y + s.h;
  let inside = false;
  for (let i = 0, j = s.points.length - 1; i < s.points.length; j = i++) {
    const [xi, yi] = s.points[i];
    const [xj, yj] = s.points[j];
    if (((yi > point.y) !== (yj > point.y)) &&
      point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function onMove(event) {
  const point = coordinates(event);
  canvas.style.cursor = manifest.hotspots.some(h => hitTest(point, h)) ? 'pointer' : 'default';
}

async function onClick(event) {
  const hotspot = manifest.hotspots.find(h => hitTest(coordinates(event), h));
  if (!hotspot) return;
  if (!session?.token) return setStatus('Connect a wallet before running a workflow.');

  if (!confirm(`Run allowlisted action “${hotspot.name}”?`)) return;

  const headers = {
    'content-type': 'application/json',
    authorization: `Bearer ${session.token}`
  };

  await fetch(`${API_URL}/api/authorize-action`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      manifest,
      hotspotId: hotspot.id,
      actionId: hotspot.actionId
    })
  }).then(check);

  const result = await fetch(`${API_URL}/api/execute-workflow`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      manifest,
      hotspotId: hotspot.id,
      actionId: hotspot.actionId,
      params: {}
    })
  }).then(check).then(r => r.json());

  output.innerHTML = `<pre>${escapeHtml(JSON.stringify(result, null, 2))}</pre>`;
}

async function connectWallet() {
  if (!window.ethereum) return setStatus('A compatible EVM wallet is required.');

  const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const challenge = await fetch(`${API_URL}/api/auth/nonce`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address })
  }).then(check).then(r => r.json());

  const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [challenge.message, address]
  });

  session = await fetch(`${API_URL}/api/auth/verify`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address, message: challenge.message, signature })
  }).then(check).then(r => r.json());

  localStorage.setItem('miseos_session', JSON.stringify(session));
  setStatus(`Connected ${session.address.slice(0, 8)}…`);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const value = new Image();
    value.onload = () => resolve(value);
    value.onerror = reject;
    value.src = src;
  });
}

function check(response) {
  if (!response.ok) return response.json().catch(() => ({})).then(body => {
    throw new Error(body.error ?? `Request failed: ${response.status}`);
  });
  return response;
}

function setStatus(message) {
  statusEl.textContent = message;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
  })[char]);
}

boot().catch(error => setStatus(error.message));
