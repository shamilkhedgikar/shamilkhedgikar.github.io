import * as MarchingSquaresJS from 'https://cdn.jsdelivr.net/npm/marchingsquares@1.3.3/+esm';

function generatePermutation(seed = 30) {
  const p = new Uint8Array(512);
  const perm = new Uint8Array(256);
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (seed * 9301 + 49297) % 233280 % (i + 1);
    [perm[i], perm[j]] = [perm[j], perm[i]];
    seed++;
  }
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  return p;
}

function perlin2D(x, y, perm) {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);

  // Inline fade(t)
  const fadeX = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
  const fadeY = yf * yf * yf * (yf * (yf * 6 - 15) + 10);

  // Hash coordinates
  const aa = perm[perm[xi] + yi];
  const ab = perm[perm[xi] + yi + 1];
  const ba = perm[perm[xi + 1] + yi];
  const bb = perm[perm[xi + 1] + yi + 1];

  // Inline grad()
  function grad(hash, x, y) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  const gradAA = grad(aa, xf, yf);
  const gradBA = grad(ba, xf - 1, yf);
  const gradAB = grad(ab, xf, yf - 1);
  const gradBB = grad(bb, xf - 1, yf - 1);

  // Inline lerp()
  const x1 = gradAA + fadeX * (gradBA - gradAA);
  const x2 = gradAB + fadeX * (gradBB - gradAB);
  const result = x1 + fadeY * (x2 - x1);

  return (result + 1) / 2;
}

onmessage = function (e) {
  const { width, height, settings, withContours, levels } = e.data;
  const data = [];
  const perm = generatePermutation(settings.seed);

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      let f = settings.freq;
      let a = settings.amp;
      let n = settings.noise;
      for (let o = 0; o < settings.octaves; o++) {
        const sx = (x / settings.scale) * f;
        const sy = (y / settings.scale) * f;
        n += perlin2D(sx, sy, perm) * a;
        a *= settings.persistence;
        f *= settings.lacunarity;
      }
      row.push(n);
    }
    data.push(row);
  }

  if (withContours) {
    const contoursByLevel = {};
    levels.forEach(level => {
      contoursByLevel[level] = MarchingSquaresJS.isoLines(data, level);
    });
    postMessage({ elevation: data, contours: contoursByLevel });
  } else {
    postMessage({ elevation: data });
  }
};
