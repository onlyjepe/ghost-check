export interface Gray {
  w: number;
  h: number;
  d: Float32Array;
}

const W = 256;
const H = 192;
const GRID = 16;

export function grayFrom(source: CanvasImageSource, w = W, h = H): Gray {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser cannot read the picture.');
  ctx.drawImage(source, 0, 0, w, h);
  const pixels = ctx.getImageData(0, 0, w, h).data;
  const d = new Float32Array(w * h);
  for (let i = 0, p = 0; i < d.length; i++, p += 4) {
    d[i] = (0.299 * pixels[p] + 0.587 * pixels[p + 1] + 0.114 * pixels[p + 2]) / 255;
  }
  return { w, h, d };
}

export async function grayFromUrl(url: string): Promise<Gray> {
  const image = new Image();
  image.src = url;
  await image.decode();
  return grayFrom(image);
}

function blurred(gray: Gray): Float32Array {
  const { w, h, d } = gray;
  let src = d;
  for (let pass = 0; pass < 2; pass++) {
    const out = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0;
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            sum += src[ny * w + nx];
            n++;
          }
        }
        out[y * w + x] = sum / n;
      }
    }
    src = out;
  }
  return src;
}

export interface Shift {
  dx: number;
  dy: number;
}

export function align(reference: Gray, frame: Gray, max = 8, step = 2): Shift {
  const a = blurred(reference);
  const b = blurred(frame);
  const { w, h } = reference;
  let best: Shift = { dx: 0, dy: 0 };
  let cost = Infinity;
  for (let dy = -max; dy <= max; dy += step) {
    for (let dx = -max; dx <= max; dx += step) {
      let sum = 0;
      let n = 0;
      for (let y = max; y < h - max; y += 3) {
        for (let x = max; x < w - max; x += 3) {
          sum += Math.abs(a[y * w + x] - b[(y + dy) * w + (x + dx)]);
          n++;
        }
      }
      const value = sum / n;
      if (value < cost) {
        cost = value;
        best = { dx, dy };
      }
    }
  }
  return best;
}

export interface Signature {
  v: Float32Array;
  sd: number;
}

function cellAverage(gray: Gray, left: number, top: number, size: number): number {
  let sum = 0;
  let n = 0;
  const right = Math.min(gray.w - 1, Math.round(left + size) - 1);
  const bottom = Math.min(gray.h - 1, Math.round(top + size) - 1);
  for (let y = Math.max(0, Math.round(top)); y <= bottom; y++) {
    for (let x = Math.max(0, Math.round(left)); x <= right; x++) {
      sum += gray.d[y * gray.w + x];
      n++;
    }
  }
  return n ? sum / n : 0;
}

export function signature(gray: Gray, x: number, y: number, shift: Shift = { dx: 0, dy: 0 }, half = 0.075): Signature {
  const cx = x * gray.w + shift.dx;
  const cy = y * gray.h + shift.dy;
  const edge = Math.max(6, half * gray.w);
  const span = edge * 2;
  const v = new Float32Array(GRID * GRID);
  for (let gy = 0; gy < GRID; gy++) {
    for (let gx = 0; gx < GRID; gx++) {
      v[gy * GRID + gx] = cellAverage(gray, cx - edge + (gx * span) / GRID, cy - edge + (gy * span) / GRID, span / GRID);
    }
  }
  let mean = 0;
  for (const value of v) mean += value;
  mean /= v.length;
  let variance = 0;
  for (const value of v) variance += (value - mean) ** 2;
  const sd = Math.sqrt(variance / v.length);
  let norm = 0;
  for (let i = 0; i < v.length; i++) {
    v[i] = (v[i] - mean) / (sd || 1);
    norm += v[i] * v[i];
  }
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < v.length; i++) v[i] /= norm;
  return { v, sd };
}

export function similarity(a: Signature, b: Signature): number {
  let sum = 0;
  for (let i = 0; i < a.v.length; i++) sum += a.v[i] * b.v[i];
  return Math.max(-1, Math.min(1, sum));
}

export type Verdict = 'present' | 'missing' | 'unsure';

export const THRESHOLD = { present: 0.62, missing: 0.38 };

export function judge(score: number): { verdict: Verdict; confidence: number } {
  if (score >= THRESHOLD.present) {
    return { verdict: 'present', confidence: Math.round(100 - (1 - score) * 55) };
  }
  if (score <= THRESHOLD.missing) {
    return { verdict: 'missing', confidence: Math.round(100 - (score + 1) * 55 * 0.5 - score * 20) };
  }
  return { verdict: 'unsure', confidence: Math.round(50 + score * 20) };
}
