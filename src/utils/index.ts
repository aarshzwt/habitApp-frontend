import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate random shape SVG placeholder
export const generateShapesSVG = (size = 300, seed: number | null = null) => {
  const colors = ["#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D", "#C77DFF"];
  const shapes = [];
  const numShapes = 5;

  let rand = Math.random;
  if (seed) {
    let s = seed.toString().split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    rand = () => {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  }

  for (let i = 0; i < numShapes; i++) {
    const color = colors[Math.floor(rand() * colors.length)];
    const x = rand() * size;
    const y = rand() * size;
    const shapeType = rand();

    if (shapeType < 0.33) {
      shapes.push(`<circle cx="${x}" cy="${y}" r="${rand() * 30 + 10}" fill="${color}" />`);
    } else if (shapeType < 0.66) {
      shapes.push(`<rect x="${x}" y="${y}" width="${rand() * 30 + 10}" height="${rand() * 30 + 10}" fill="${color}" />`);
    } else {
      shapes.push(`<polygon points="${x},${y} ${x + 20},${y + 40} ${x - 20},${y + 40}" fill="${color}" />`);
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" style="background:#f8f9fa">${shapes.join("")}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};