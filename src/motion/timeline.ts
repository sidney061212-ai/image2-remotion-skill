export const clamp01 = (value: number): number => {
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
};

export const phaseProgress = (frame: number, start: number, end: number): number => {
  if (end <= start) {
    return frame >= end ? 1 : 0;
  }

  return clamp01((frame - start) / (end - start));
};

export const staggerProgress = (
  frame: number,
  index: number,
  stagger: number,
  duration: number
): number => {
  const localStart = index * stagger;
  return phaseProgress(frame, localStart, localStart + duration);
};
