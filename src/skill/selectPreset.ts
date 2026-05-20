import type {MultiImageMotionPreset, MultiImageMotionRequest} from './schema';
import {getImplementedPresetIds} from '../presets';

export const OUTRO_NO_RENDERABLE_PRESETS_ERROR = 'outro useCase has no renderable presets in v1.';

export const selectPreset = (request: MultiImageMotionRequest): MultiImageMotionPreset => {
  if (request.motion.preset) {
    return request.motion.preset;
  }

  const useCase = request.motion.useCase;
  const implemented = new Set<MultiImageMotionPreset>(getImplementedPresetIds());

  const pickImplemented = (candidate: MultiImageMotionPreset): MultiImageMotionPreset => {
    if (implemented.has(candidate)) {
      return candidate;
    }

    return 'orbit-ring-intro';
  };

  if (useCase === 'intro') {
    return pickImplemented('orbit-ring-intro');
  }

  if (useCase === 'showcase') {
    return pickImplemented('gallery-corridor');
  }

  if (useCase === 'wow') {
    return pickImplemented('helix-tunnel');
  }

  if (useCase === 'outro') {
    throw new Error(OUTRO_NO_RENDERABLE_PRESETS_ERROR);
  }

  return pickImplemented('orbit-ring-intro');
};
