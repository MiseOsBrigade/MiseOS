const canvas = document.getElementById('stage');
const log = document.getElementById('log');
const ctx = canvas.getContext('2d');
const manifest = await fetch('/manifest/clickable-character.manifest.example.json').then(r => r.json());
const img = new Image();
function hit(x,y,h){const s=h.shape;if(s.type==='rect')return x>=s.x&&x<=s.x+s.w&&y>=s.y&&y<=s.y+s.h;if(s.type==='circle'){const dx=x-s.x,dy=y-s.y;return dx*dx+dy*dy<=s.r*s.r}return false}
img.onload=()=>{canvas.width=img.width;canvas.height=img.height;ctx.drawImage(img,0,0)};img.src=manifest.asset.pngPath;
canvas.addEventListener('click', async e=>{const r=canvas.getBoundingClientRect();const x=(e.clientX-r.left)*canvas.width/r.width;const y=(e.clientY-r.top)*canvas.height/r.height;const h=manifest.hotspots.find(h=>hit(x,y,h));if(!h)return;if(!confirm(`Run ${h.actionId}?`))return;const out=await fetch('/api/execute-workflow',{method:'POST',body:JSON.stringify({actionId:h.actionId,context:{hotspotId:h.id}})}).then(r=>r.json());log.textContent=JSON.stringify(out,null,2)});
