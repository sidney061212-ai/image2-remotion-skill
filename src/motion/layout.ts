import {ASPECT_RATIO_DIMENSIONS} from '../skill/defaults';
import type {AspectRatio} from '../skill/schema';
import {createSeededRandom} from '../utils/seededRandom';

export interface Positioned3D {
  x: number;
  y: number;
  z: number;
  rotateY?: number;
  rotateX?: number;
  scale?: number;
}

export const getAspectDimensions = (aspectRatio: AspectRatio): {width: number; height: number} => {
  return ASPECT_RATIO_DIMENSIONS[aspectRatio];
};

export const distributeOnCircle = (
  count: number,
  radius: number,
  seed = 1,
  yOffset = 0
): Positioned3D[] => {
  const random = createSeededRandom(seed);
  const safeCount = Math.max(count, 1);

  return Array.from({length: count}, (_, index) => {
    const angle = (index / safeCount) * Math.PI * 2;
    const jitter = (random() - 0.5) * radius * 0.08;
    const x = Math.cos(angle) * (radius + jitter);
    const z = Math.sin(angle) * (radius + jitter);

    return {
      x,
      y: yOffset + (random() - 0.5) * 24,
      z,
      rotateY: (-angle * 180) / Math.PI + 90,
      scale: 1
    };
  });
};

export const distributeGrid = (
  count: number,
  width: number,
  height: number,
  columns?: number
): Positioned3D[] => {
  const cols = columns ?? Math.max(2, Math.ceil(Math.sqrt(count)));
  const rows = Math.max(1, Math.ceil(count / cols));
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  return Array.from({length: count}, (_, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    return {
      x: col * cellWidth + cellWidth / 2 - width / 2,
      y: row * cellHeight + cellHeight / 2 - height / 2,
      z: 0,
      scale: 1
    };
  });
};

export const distributeHelix = (
  count: number,
  radius: number,
  depthSpacing: number,
  seed = 1
): Positioned3D[] => {
  const random = createSeededRandom(seed);

  return Array.from({length: count}, (_, index) => {
    const turns = index * 0.8;
    const angle = turns;
    const x = Math.cos(angle) * (radius + (random() - 0.5) * radius * 0.1);
    const y = Math.sin(angle) * (radius * 0.5 + (random() - 0.5) * 24);
    const z = -index * depthSpacing;

    return {
      x,
      y,
      z,
      rotateY: (-angle * 180) / Math.PI,
      rotateX: (random() - 0.5) * 10,
      scale: 1
    };
  });
};

export const distributeCorridor = (
  count: number,
  laneOffset: number,
  depthSpacing: number,
  seed = 1
): Positioned3D[] => {
  const random = createSeededRandom(seed);

  return Array.from({length: count}, (_, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    const x = side * (laneOffset + (random() - 0.5) * 30);
    const y = (random() - 0.5) * 80;
    const z = -index * depthSpacing;

    return {
      x,
      y,
      z,
      rotateY: side === -1 ? 18 : -18,
      scale: 1
    };
  });
};
