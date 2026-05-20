import type {MultiImageMotionPreset, MultiImageMotionRequest} from './schema';

export const selectPreset = (request: MultiImageMotionRequest): MultiImageMotionPreset => {
  if (request.motion.preset) {
    return request.motion.preset;
  }

  const count = request.assets.length;
  const useCase = request.motion.useCase;
  const hold = request.motion.imageHoldSeconds;

  if (useCase === 'intro') {
    if (count <= 6) {
      return 'rotary-fan-intro';
    }
    if (count <= 12) {
      return 'orbit-ring-intro';
    }
    return 'magnetic-grid-intro';
  }

  if (useCase === 'showcase') {
    if (hold && hold >= 3) {
      return 'coverflow-focus';
    }
    if (count >= 10) {
      return 'gallery-corridor';
    }
    return 'page-flip-gallery';
  }

  if (useCase === 'wow') {
    return 'helix-tunnel';
  }

  return 'magnetic-grid-intro';
};
