export const MULTI_IMAGE_USE_CASES = ['intro', 'showcase', 'wow', 'outro'] as const;

export type MultiImageUseCase = (typeof MULTI_IMAGE_USE_CASES)[number];

export const MULTI_IMAGE_MOTION_PRESETS = [
  'orbit-ring-intro',
  'drop-flip-intro',
  'rotary-fan-intro',
  'magnetic-grid-intro',
  'gallery-corridor',
  'coverflow-focus',
  'page-flip-gallery',
  'helix-tunnel'
] as const;

export type MultiImageMotionPreset = (typeof MULTI_IMAGE_MOTION_PRESETS)[number];

export const ASPECT_RATIOS = ['16:9', '9:16', '1:1'] as const;

export type AspectRatio = (typeof ASPECT_RATIOS)[number];

export const MOTION_INTENSITIES = ['low', 'medium', 'high'] as const;

export type MotionIntensity = (typeof MOTION_INTENSITIES)[number];

export const FINAL_COMPOSITIONS = ['title-center', 'grid', 'stack', 'orbit', 'main-focus'] as const;

export type FinalComposition = (typeof FINAL_COMPOSITIONS)[number];

export const THEME_MOODS = ['cinematic', 'tech', 'luxury', 'playful', 'minimal'] as const;

export const THEME_BACKGROUNDS = ['dark-gradient', 'light-clean', 'glass', 'deep-space', 'paper'] as const;

export const THEME_FRAME_STYLES = ['none', 'thin-border', 'glass-card', 'polaroid', 'poster'] as const;

export interface MultiImageAsset {
  path: string;
  width?: number;
  height?: number;
}

export interface MultiImageMotionRequest {
  version: '1.0';
  assets: MultiImageAsset[];
  output: {
    aspectRatio: AspectRatio;
    durationSeconds?: number;
    fps?: number;
  };
  motion: {
    useCase: MultiImageUseCase;
    preset?: MultiImageMotionPreset;
    intensity?: MotionIntensity;
    imageHoldSeconds?: number;
    finalComposition?: FinalComposition;
  };
  text?: {
    title?: string;
    subtitle?: string;
    caption?: string;
  };
  theme?: {
    mood?: 'cinematic' | 'tech' | 'luxury' | 'playful' | 'minimal';
    background?: 'dark-gradient' | 'light-clean' | 'glass' | 'deep-space' | 'paper';
    frameStyle?: 'none' | 'thin-border' | 'glass-card' | 'polaroid' | 'poster';
  };
  render?: {
    seed?: number;
    debug?: boolean;
  };
}

export interface NormalizedMultiImageMotionRequest extends MultiImageMotionRequest {
  output: {
    aspectRatio: AspectRatio;
    durationSeconds: number;
    fps: number;
    width: number;
    height: number;
  };
  motion: {
    useCase: MultiImageUseCase;
    preset: MultiImageMotionPreset;
    intensity: MotionIntensity;
    imageHoldSeconds: number;
    finalComposition: FinalComposition;
  };
  theme: {
    mood: 'cinematic' | 'tech' | 'luxury' | 'playful' | 'minimal';
    background: 'dark-gradient' | 'light-clean' | 'glass' | 'deep-space' | 'paper';
    frameStyle: 'none' | 'thin-border' | 'glass-card' | 'polaroid' | 'poster';
  };
  render: {
    seed: number;
    debug: boolean;
  };
}

export const isAspectRatio = (value: string): value is AspectRatio => {
  return (ASPECT_RATIOS as readonly string[]).includes(value);
};

export const isUseCase = (value: string): value is MultiImageUseCase => {
  return (MULTI_IMAGE_USE_CASES as readonly string[]).includes(value);
};

export const isPreset = (value: string): value is MultiImageMotionPreset => {
  return (MULTI_IMAGE_MOTION_PRESETS as readonly string[]).includes(value);
};

export const isIntensity = (value: string): value is MotionIntensity => {
  return (MOTION_INTENSITIES as readonly string[]).includes(value);
};

export const isFinalComposition = (value: string): value is FinalComposition => {
  return (FINAL_COMPOSITIONS as readonly string[]).includes(value);
};
