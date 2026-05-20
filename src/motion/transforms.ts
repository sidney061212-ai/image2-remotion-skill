export interface TransformParts {
  x?: number;
  y?: number;
  z?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
}

export const toTransform = (parts: TransformParts): string => {
  const tokens: string[] = [];

  if (typeof parts.x === 'number' || typeof parts.y === 'number' || typeof parts.z === 'number') {
    tokens.push(`translate3d(${parts.x ?? 0}px, ${parts.y ?? 0}px, ${parts.z ?? 0}px)`);
  }
  if (typeof parts.rotateX === 'number') {
    tokens.push(`rotateX(${parts.rotateX}deg)`);
  }
  if (typeof parts.rotateY === 'number') {
    tokens.push(`rotateY(${parts.rotateY}deg)`);
  }
  if (typeof parts.rotateZ === 'number') {
    tokens.push(`rotateZ(${parts.rotateZ}deg)`);
  }
  if (typeof parts.scale === 'number') {
    tokens.push(`scale(${parts.scale})`);
  }

  return tokens.join(' ');
};
