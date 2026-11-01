/*
Neural Aurora Field — Cødeart / p5.js full working sketch

Controls:
- Move finger/mouse: bend the particle field
- 1 / 2 / 3: low / medium / high particle density
- H: toggle HUD
- S: save canvas
- R: reset background
*/

let t = 0;

const CONFIG = {
  particles: 12000,
  fadeAlpha: 18,
  glowAlpha: 42,
  strokeWeight: 1.15,
  speed: Math.PI / 260,
  safeDivisor: 0.001,
  showHUD: true,
};

function setup() {
  createCanvas(600, 600);
  pixelDensity(min(2, displayDensity()));
  background(6, 8, 18);
}

function draw() {
  // Soft trail instead of hard reset.
  blendMode(BLEND);
  noStroke();
  fill(6, 8, 18, CONFIG.fadeAlpha);
  rect(0, 0, width, height);

  translate(width / 2, height / 2);
  blendMode(ADD);

  const pointerX = touches.length ? touches[0].x : mouseX;
  const pointerY = touches.length ? touches[0].y : mouseY;
  const mx = map(constrain(pointerX, 0, width), 0, width, -2, 2);
  const my = map(constrain(pointerY, 0, height), 0, height, -2, 2);

  for (let i = CONFIG.particles; i--; ) {
    const y = i / 235;
    const x = i;

    const k =
      (4 + sin(y * 2 - t) * 3) *
      cos(x / 29 + mx * 0.08);

    const safeK = abs(k) < CONFIG.safeDivisor
      ? CONFIG.safeDivisor * Math.sign(k || 1)
      : k;

    const e = y / 8 - 13;
    const d = mag(k, e);

    const q =
      3 * sin(k * 2) +
      0.3 / safeK +
      sin(y / 25 + my * 0.1) *
        k *
        (9 + 4 * sin(e * 9 - d * 3 + t * 2));

    const c = d - t;

    const px = q + 30 * cos(c) + 90 * sin(t * 0.35);
    const py = q * sin(c) + d * 39 - 180;

    const hueShift = sin(d * 0.8 + t * 2);
    const r = 90 + 90 * sin(hueShift + 0.2);
    const g = 120 + 80 * sin(hueShift + 2.1);
    const b = 190 + 65 * sin(hueShift + 4.2);

    stroke(r, g, b, CONFIG.glowAlpha);
    strokeWeight(CONFIG.strokeWeight);
    point(px, py);
  }

  blendMode(BLEND);
  drawVignette();

  if (CONFIG.showHUD) {
    drawHUD();
  }

  t += CONFIG.speed;
}

function drawVignette() {
  noFill();
  stroke(0, 40);
  strokeWeight(80);
  rect(-width / 2, -height / 2, width, height);
}

function drawHUD() {
  resetMatrix();
  noStroke();
  fill(255, 230);
  textSize(12);
  textFont("monospace");
  text(
    `Neural Aurora Field  |  particles ${CONFIG.particles}  |  fps ${nf(frameRate(), 2, 1)}`,
    16,
    height - 18
  );
}

function keyPressed() {
  if (key === "1") CONFIG.particles = 4000;
  if (key === "2") CONFIG.particles = 8000;
  if (key === "3") CONFIG.particles = 12000;
  if (key === "h" || key === "H") CONFIG.showHUD = !CONFIG.showHUD;
  if (key === "r" || key === "R") background(6, 8, 18);
  if (key === "s" || key === "S") saveCanvas("neural_aurora_field", "png");
}
