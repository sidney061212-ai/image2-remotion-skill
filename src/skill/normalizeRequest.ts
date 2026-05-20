import {
  ASPECT_RATIO_DIMENSIONS,
  DEFAULT_DURATION_SECONDS_BY_USE_CASE,
  DEFAULT_FINAL_COMPOSITION_BY_USE_CASE,
  DEFAULT_FPS,
  DEFAULT_IMAGE_HOLD_SECONDS_BY_USE_CASE,
  DEFAULT_INTENSITY,
  DEFAULT_RENDER,
  DEFAULT_THEME
} from './defaults';
import {assertRenderablePreset, getPresetDefinition} from '../presets';
import {selectPreset} from './selectPreset';
import type {MultiImageMotionRequest, NormalizedMultiImageMotionRequest} from './schema';
import {validateRequest} from './validateRequest';

export const normalizeRequest = (
  request: MultiImageMotionRequest
): NormalizedMultiImageMotionRequest => {
  validateRequest(request);

  const useCase = request.motion.useCase;
  const aspectRatio = request.output.aspectRatio;
  const fps = request.output.fps ?? DEFAULT_FPS;
  const durationSeconds = request.output.durationSeconds ?? DEFAULT_DURATION_SECONDS_BY_USE_CASE[useCase];
  const imageHoldSeconds =
    request.motion.imageHoldSeconds ?? DEFAULT_IMAGE_HOLD_SECONDS_BY_USE_CASE[useCase];

  const preset =
    request.motion.preset ??
    selectPreset({
      ...request,
      output: {
        ...request.output,
        durationSeconds,
        fps
      },
      motion: {
        ...request.motion,
        imageHoldSeconds
      }
    });
  const presetDefinition = getPresetDefinition(preset);
  if (presetDefinition.useCase !== useCase) {
    throw new Error(
      `Preset '${preset}' is not valid for useCase '${useCase}'. Expected a '${useCase}' preset.`
    );
  }

  assertRenderablePreset(preset);

  const finalComposition =
    request.motion.finalComposition ?? DEFAULT_FINAL_COMPOSITION_BY_USE_CASE[useCase];

  const dims = ASPECT_RATIO_DIMENSIONS[aspectRatio];

  return {
    ...request,
    output: {
      aspectRatio,
      durationSeconds,
      fps,
      width: dims.width,
      height: dims.height
    },
    motion: {
      useCase,
      preset,
      intensity: request.motion.intensity ?? DEFAULT_INTENSITY,
      imageHoldSeconds,
      finalComposition
    },
    theme: {
      mood: request.theme?.mood ?? DEFAULT_THEME.mood,
      background: request.theme?.background ?? DEFAULT_THEME.background,
      frameStyle: request.theme?.frameStyle ?? DEFAULT_THEME.frameStyle
    },
    render: {
      seed: request.render?.seed ?? DEFAULT_RENDER.seed,
      debug: request.render?.debug ?? DEFAULT_RENDER.debug
    }
  };
};
