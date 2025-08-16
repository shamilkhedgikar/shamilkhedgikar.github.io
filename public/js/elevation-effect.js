const canvas = document.getElementById("elevation-bg");
const ctx = canvas.getContext("2d");

// Settings
let currentSettings = {
  scale: 40,
  octaves: 3,
  persistence: 0.5,
  lacunarity: 2.0,
  seed: 42,
  freq: 1.5,
  amp: 1.0,
  noise: 0.0,
};

//rgb(244, 244, 244)

const levels = [0.2, 0.4, 0.6, 0.8, 0.9];
const glassMapStyle = {
  minHeight: 0.0,
  maxHeight: 10,
  minColor: [244, 244, 244],
  maxColor: [244, 244, 244],
  lerpAdjustment: -0.05,
};

// Start worker
const worker = new Worker("/js/terrain-worker.js", { type: "module" });

/*
function drawGlassColorElevation(ctx, elevation, width, height, mapType) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const minHeight = mapType.minHeight;
  const maxHeight = mapType.maxHeight;
  const lerpAdj = mapType.lerpAdjustment;
  const minColor = mapType.minColor;
  const maxColor = mapType.maxColor;

  let i = 0;

  for (let y = 0; y < height; y++) {
    const prevRow = elevation[y - 1] || elevation[y];
    const row = elevation[y];

    for (let x = 0; x < width; x++) {
      const val = row[x];
      const normalized = (val - minHeight) / (maxHeight - minHeight);
      const lerpFactor = normalized + lerpAdj;

      const rBase = minColor[0] + (maxColor[0] - minColor[0]) * lerpFactor;
      const gBase = minColor[1] + (maxColor[1] - minColor[1]) * lerpFactor;
      const bBase = minColor[2] + (maxColor[2] - minColor[2]) * lerpFactor;

      const dx = x > 0 ? val - row[x - 1] : 0;
      const dy = val - prevRow[x];
      const slope = dx * dx + dy * dy; // skip sqrt for perf
      const highlight = Math.max(0, 1 - slope * 12); 
      const gloss = highlight * 50;

      data[i++] = Math.min(255, rBase + gloss);
      data[i++] = Math.min(255, gBase + gloss);
      data[i++] = Math.min(255, bBase + gloss);
      data[i++] = 80 + normalized * 70;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  ctx.imageSmoothingEnabled = true;
}
*/  
/*
function drawZShadedElevation(ctx, elevation, width, height, mapType) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const minHeight = mapType.minHeight;
  const maxHeight = mapType.maxHeight;
  const lerpAdj = mapType.lerpAdjustment;
  const minColor = mapType.minColor;
  const maxColor = mapType.maxColor;

  const lightDir = { x: -1, y: -1, z: 1 }; // Light coming from top-left
  const len = Math.hypot(lightDir.x, lightDir.y, lightDir.z);
  lightDir.x /= len;
  lightDir.y /= len;
  lightDir.z /= len;

  let i = 0;

  for (let y = 0; y < height; y++) {
    const prev = elevation[y - 1] || elevation[y];
    const curr = elevation[y];
    const next = elevation[y + 1] || elevation[y];

    for (let x = 0; x < width; x++) {
      const left = x > 0 ? curr[x - 1] : curr[x];
      const right = x < width - 1 ? curr[x + 1] : curr[x];
      const up = prev[x];
      const down = next[x];

      // Surface normal via finite difference
      const dx = (right - left) * 0.5;
      const dy = (down - up) * 0.5;
      const dz = 1.0;

      const nx = -dx;
      const ny = -dy;
      const nz = dz;

      const nLen = Math.hypot(nx, ny, nz);
      const dot = (nx * lightDir.x + ny * lightDir.y + nz * lightDir.z) / nLen;

      const lighting = Math.max(0, dot);

      const val = curr[x];
      const normalized = (val - minHeight) / (maxHeight - minHeight);
      const lerpFactor = normalized + lerpAdj;

      const r = minColor[0] + (maxColor[0] - minColor[0]) * lerpFactor;
      const g = minColor[1] + (maxColor[1] - minColor[1]) * lerpFactor;
      const b = minColor[2] + (maxColor[2] - minColor[2]) * lerpFactor;

      data[i++] = r * lighting;
      data[i++] = g * lighting;
      data[i++] = b * lighting;
      data[i++] = 90 + normalized * 60; // alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);
  ctx.imageSmoothingEnabled = true;
}
*/

/*
function drawZShadedElevation(ctx, elevation, width, height, mapType) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const minHeight = mapType.minHeight;
  const maxHeight = mapType.maxHeight;
  const lerpAdj = mapType.lerpAdjustment;
  const minColor = mapType.minColor;
  const maxColor = mapType.maxColor;

  const lightDir = { x: -1, y: -1, z: 1 }; // Light coming from top-left
  const lightLen = Math.hypot(lightDir.x, lightDir.y, lightDir.z);
  lightDir.x /= lightLen;
  lightDir.y /= lightLen;
  lightDir.z /= lightLen;

  let i = 0;

  for (let y = 0; y < height; y++) {
    const prev = elevation[y - 1] || elevation[y];
    const curr = elevation[y];
    const next = elevation[y + 1] || elevation[y];

    for (let x = 0; x < width; x++) {
      const left = x > 0 ? curr[x - 1] : curr[x];
      const right = x < width - 1 ? curr[x + 1] : curr[x];
      const up = prev[x];
      const down = next[x];

      // Surface normal
      const dx = (right - left) * 0.5;
      const dy = (down - up) * 0.5;
      const dz = 1.0;

      const nx = -dx;
      const ny = -dy;
      const nz = dz;
      const nLen = Math.hypot(nx, ny, nz);
      const dot = (nx * lightDir.x + ny * lightDir.y + nz * lightDir.z) / nLen;
      const lighting = Math.max(0.15, dot);  // base ambient

      const val = curr[x];
      const normalized = (val - minHeight) / (maxHeight - minHeight);
      const lerpFactor = Math.max(0, Math.min(1, normalized + lerpAdj));

      const r = minColor[0] + (maxColor[0] - minColor[0]) * lerpFactor;
      const g = minColor[1] + (maxColor[1] - minColor[1]) * lerpFactor;
      const b = minColor[2] + (maxColor[2] - minColor[2]) * lerpFactor;

      // Optional: Z-based atmospheric perspective (fading far heights)
      const depthFade = 1.0 - Math.pow(normalized, 2);  // fades peaks
      const alpha = 90 + normalized * 60 * depthFade;

      data[i++] = r * lighting;
      data[i++] = g * lighting;
      data[i++] = b * lighting;
      data[i++] = alpha;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  ctx.imageSmoothingEnabled = true;
}
*/

const mapType = {
  minHeight: 0.0,
  maxHeight: 10.0,
  minColor: [120, 190, 220],  // oceanic blue
  midColor: [180, 230, 250],  // icy sky-blue
  maxColor: [255, 255, 255],  // white snow/glass
  lerpAdjustment: -0.05
};

function lerpColor(minColor, maxColor, t) {
  return minColor.map((c, i) =>
    Math.round(c + (maxColor[i] - c) * t)
  );
}

function contourElevation(ctx, elevation, width, height, mapType) {
  if (window.p5ContourRenderer) return;

  window.p5ContourRenderer = new p5((sketch) => {
    const scale = 10;
    const rows = elevation.length;
    const cols = elevation[0].length;

    sketch.setup = () => {
      const elevationCanvas = document.getElementById("elevation-bg");

      // Ensure same width/height as 2D canvas
      const canvasWidth = elevationCanvas?.width || window.innerWidth;
      const canvasHeight = elevationCanvas?.height || window.innerHeight;

      const c = sketch.createCanvas(canvasWidth, canvasHeight, sketch.WEBGL);
      c.id("terrain-canvas");

      // Mount in container
      const container = document.querySelector(".elevation-container");
      if (container) container.prepend(c.elt);

      sketch.noFill();
      sketch.strokeWeight(1.2);
    };

    sketch.draw = () => {
      sketch.clear();
      sketch.background(mapType.minColor[0], mapType.minColor[1], mapType.minColor[2], 40);

      const scrollY = window.scrollY || 0;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollNorm = sketch.constrain(scrollY / maxScroll, 0, 1);

      const rotationX = sketch.lerp(sketch.HALF_PI, sketch.PI / 6, scrollNorm);
      sketch.rotateX(rotationX);
      sketch.rotateZ(sketch.PI);

      sketch.translate(-cols * scale / 2, -rows * scale / 2);

      for (let y = 0; y < rows - 1; y++) {
        sketch.beginShape(sketch.TRIANGLE_STRIP);
        for (let x = 0; x < cols; x++) {
          const z1 = elevation[y][x] * 15;
          const z2 = elevation[y + 1][x] * 15;

          const colorBlend = elevation[y][x];
          const r = sketch.lerp(mapType.minColor[0], mapType.maxColor[0], colorBlend);
          const g = sketch.lerp(mapType.minColor[1], mapType.maxColor[1], colorBlend);
          const b = sketch.lerp(mapType.minColor[2], mapType.maxColor[2], colorBlend);

          sketch.stroke(r, g, b, 140);
          sketch.vertex(x * scale, y * scale, z1);
          sketch.vertex(x * scale, (y + 1) * scale, z2);
        }
        sketch.endShape();
      }
    };
  });
}


//rgba(229, 229, 229, 0.3)

function getContourColor(level) {
  const blend = Math.min(Math.max(level, 0), 1);
  const low = [229, 229, 229];
  const high = [65, 65, 65];
  const r = Math.round(low[0] + (high[0] - low[0]) * blend);
  const g = Math.round(low[1] + (high[1] - low[1]) * blend);
  const b = Math.round(low[2] + (high[2] - low[2]) * blend);
  return `rgba(${r}, ${g}, ${b}, ${0.2 + 0.6 * blend})`;
}

function drawContours(ctx, contoursByLevel) {
  ctx.save();
  ctx.shadowColor = 'rgb(52, 52, 52)';
  ctx.shadowBlur = 0.8;

  levels.forEach((level, i) => {
    const contours = contoursByLevel[level];
    const dashLength = 5 - i;
    const gapLength = 1 + (i % 2);
    ctx.setLineDash([dashLength, gapLength]);
    ctx.strokeStyle = getContourColor(level);
    ctx.lineWidth = level + 1;

    contours.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line[0][0], line[0][1]);
      for (let j = 1; j < line.length; j++) {
        ctx.lineTo(line[j][0], line[j][1]);
      }
      ctx.stroke();
    });
  });

  ctx.restore();
}

function updateCanvasSize() {
  const canvas = document.getElementById("elevation-bg");
  const ring = document.querySelector(".glass-ring");

  if (!canvas || !ring) return;

  const rect = ring.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const ringMidpoint = rect.top + scrollTop + rect.height / 2;

  canvas.width = document.documentElement.scrollWidth;
  canvas.height = Math.round(ringMidpoint); // Limit canvas height to midpoint
}

function renderTerrain() {
  updateCanvasSize();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const message = {
    width: canvas.width,
    height: canvas.height,
    settings: currentSettings,
    withContours: true,
    levels,
  };

  const t0 = performance.now();
  worker.postMessage(message);

  worker.onmessage = (e) => {
    const { elevation, contours } = e.data;

    //drawZShadedElevation(ctx, elevation, canvas.width, canvas.height, mapType);
    drawContours(ctx, contours);
    contourElevation(ctx,elevation,ctx.width,ctx.height,mapType);
    console.log(`⛰️ Rendered in ${(performance.now() - t0).toFixed(1)} ms`);
  };
}

function updateSettingsFromSliders() {
  currentSettings.scale = +document.getElementById("scaleSlider").value;
  currentSettings.octaves = +document.getElementById("octaveSlider").value;
  currentSettings.persistence = +document.getElementById("persistenceSlider").value;
  currentSettings.lacunarity = +document.getElementById("lacunaritySlider").value;
  currentSettings.freq = +document.getElementById("frequencySlider").value;
  currentSettings.amp = +document.getElementById("amplitudeSlider").value;
  currentSettings.noise = +document.getElementById("noiseSlider").value;
}

function onSliderChange() {
  updateSettingsFromSliders();
  renderTerrain();
}

window.addEventListener("DOMContentLoaded", () => {
  renderTerrain();

  [
    "scaleSlider",
    "octaveSlider",
    "persistenceSlider",
    "lacunaritySlider",
    "frequencySlider",
    "amplitudeSlider",
    "noiseSlider"
  ].forEach(id => {
    const slider = document.getElementById(id);
    if (slider) slider.addEventListener("input", onSliderChange);
  });
});

const pad = document.getElementById("control-pad");
const ctx_2 = pad.getContext("2d");
const PAD_SIZE = 200;

let controllerPoint = { x: 100, y: 100 }; // Initial in center
let isDragging = false;

// Draw controller
function drawPad() {
  ctx_2.clearRect(0, 0, PAD_SIZE, PAD_SIZE);
  ctx_2.fillStyle = "#e0e0e055";
  ctx_2.fillRect(0, 0, PAD_SIZE, PAD_SIZE);

  // Guidelines
  ctx_2.strokeStyle = "#999";
  ctx_2.beginPath();
  ctx_2.moveTo(PAD_SIZE / 2, 0);
  ctx_2.lineTo(PAD_SIZE / 2, PAD_SIZE);
  ctx_2.moveTo(0, PAD_SIZE / 2);
  ctx_2.lineTo(PAD_SIZE, PAD_SIZE / 2);
  ctx_2.stroke();

  // Dot
  ctx_2.beginPath();
  ctx_2.arc(controllerPoint.x, controllerPoint.y, 6, 0, Math.PI * 2);
  ctx_2.fillStyle = "#333";
  ctx_2.fill();
}

drawPad();

// Normalize 0–1
function normalizePad(val) {
  return Math.max(0, Math.min(1, val / PAD_SIZE));
}

function updateFromControlPoint() {
  const nx = normalizePad(controllerPoint.x);
  const ny = normalizePad(controllerPoint.y);

  // Map to Perlin settings
  currentSettings.scale = 20 + nx * 80;               // 20–100
  currentSettings.amp = 1.0 - nx * 0.6;               // 1.0–0.4
  currentSettings.noise = nx * 0.5;                   // 0–0.5

  currentSettings.octaves = Math.round(1 + (1 - ny) * 4); // 5–1
  currentSettings.lacunarity = 1.2 + (1 - ny) * 1.8;      // 1.2–3.0
  currentSettings.persistence = 0.3 + (1 - ny) * 0.5;     // 0.3–0.8

  renderTerrain(); // Trigger redraw
}

// Event handling
pad.addEventListener("mousedown", (e) => {
  isDragging = true;
  moveControlPoint(e);
});

pad.addEventListener("mousemove", (e) => {
  if (isDragging) moveControlPoint(e);
});

pad.addEventListener("mouseup", () => {
  isDragging = false;
});

pad.addEventListener("mouseleave", () => {
  isDragging = false;
});

function moveControlPoint(e) {
  const rect = pad.getBoundingClientRect();
  controllerPoint.x = e.clientX - rect.left;
  controllerPoint.y = e.clientY - rect.top;
  drawPad();
  updateFromControlPoint();
}

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;

  const percent = Math.min(scrollY / maxScroll, 1);
  const angle = (percent) * 90; // from 0 to 90 degrees

  const canvas = document.getElementById("elevation-bg");
  canvas.style.transform = `rotateX(${angle}deg)`;
});