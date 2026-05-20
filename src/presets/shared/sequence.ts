import {clamp01} from '../../motion/timeline';

export interface StepState {
  stepIndex: number;
  localFrame: number;
  stepFrames: number;
  totalFrames: number;
}

export const resolveStepFrames = (
  fps: number,
  imageHoldSeconds: number,
  fallbackSeconds: number
): number => {
  const requested = Math.round(imageHoldSeconds * fps);
  const fallback = Math.round(fallbackSeconds * fps);
  return Math.max(1, requested > 0 ? requested : fallback);
};

export const getStepState = (frame: number, count: number, stepFrames: number): StepState => {
  const safeCount = Math.max(1, count);
  const totalFrames = safeCount * stepFrames;
  const clampedFrame = Math.min(Math.max(frame, 0), totalFrames - 1);
  const stepIndex = Math.min(safeCount - 1, Math.floor(clampedFrame / stepFrames));
  const localFrame = clampedFrame - stepIndex * stepFrames;

  return {
    stepIndex,
    localFrame,
    stepFrames,
    totalFrames
  };
};

export const inHoldOut = (
  localFrame: number,
  stepFrames: number,
  inRatio = 0.18,
  outRatio = 0.2
): {enter: number; hold: number; exit: number} => {
  const inFrames = Math.max(1, Math.round(stepFrames * inRatio));
  const outFrames = Math.max(1, Math.round(stepFrames * outRatio));
  const holdStart = inFrames;
  const holdEnd = Math.max(holdStart + 1, stepFrames - outFrames);

  return {
    enter: clamp01(localFrame / inFrames),
    hold: clamp01((localFrame - holdStart) / Math.max(1, holdEnd - holdStart)),
    exit: clamp01((localFrame - holdEnd) / Math.max(1, stepFrames - holdEnd))
  };
};
