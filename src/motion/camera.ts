import {interpolate, spring} from 'remotion';

export const cameraZoom = (
  frame: number,
  fps: number,
  from: number,
  to: number,
  damping = 120
): number => {
  const p = spring({frame, fps, config: {damping}});
  return interpolate(p, [0, 1], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};

export const cameraPushIn = (
  frame: number,
  durationInFrames: number,
  fromZ: number,
  toZ: number
): number => {
  return interpolate(frame, [0, durationInFrames], [fromZ, toZ], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
};

export const cameraSway = (frame: number, amplitude: number, speed = 0.04): number => {
  return Math.sin(frame * speed) * amplitude;
};
