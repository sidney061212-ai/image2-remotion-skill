import {clamp01} from './timeline';

export const depthScale = (z: number, nearZ: number, farZ: number, minScale: number, maxScale: number): number => {
  const normalized = clamp01((z - farZ) / (nearZ - farZ));
  return minScale + (maxScale - minScale) * normalized;
};

export const depthOpacity = (z: number, nearZ: number, farZ: number, minOpacity = 0.3, maxOpacity = 1): number => {
  const normalized = clamp01((z - farZ) / (nearZ - farZ));
  return minOpacity + (maxOpacity - minOpacity) * normalized;
};
