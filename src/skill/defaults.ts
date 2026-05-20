import type {
  AspectRatio,
  FinalComposition,
  MotionIntensity,
  MultiImageUseCase,
  NormalizedMultiImageMotionRequest
} from './schema';

export const DEFAULT_FPS = 30;

export const ASPECT_RATIO_DIMENSIONS: Record<AspectRatio, {width: number; height: number}> = {
  '16:9': {width: 1920, height: 1080},
  '9:16': {width: 1080, height: 1920},
  '1:1': {width: 1080, height: 1080}
};

export const DEFAULT_DURATION_SECONDS_BY_USE_CASE: Record<MultiImageUseCase, number> = {
  intro: 5,
  showcase: 12,
  wow: 8,
  outro: 5
};

export const DEFAULT_INTENSITY: MotionIntensity = 'medium';

export const DEFAULT_IMAGE_HOLD_SECONDS_BY_USE_CASE: Record<MultiImageUseCase, number> = {
  intro: 1.2,
  showcase: 3,
  wow: 0.8,
  outro: 1.5
};

export const DEFAULT_FINAL_COMPOSITION_BY_USE_CASE: Record<MultiImageUseCase, FinalComposition> = {
  intro: 'title-center',
  showcase: 'main-focus',
  wow: 'orbit',
  outro: 'grid'
};

export const DEFAULT_THEME: NormalizedMultiImageMotionRequest['theme'] = {
  mood: 'cinematic',
  background: 'black',
  frameStyle: 'glass-card'
};

export const DEFAULT_RENDER: NormalizedMultiImageMotionRequest['render'] = {
  seed: 1,
  debug: false
};
