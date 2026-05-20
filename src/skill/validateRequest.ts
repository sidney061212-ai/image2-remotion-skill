import {
  isAspectRatio,
  isFinalComposition,
  isIntensity,
  isPreset,
  isUseCase,
  type MultiImageMotionRequest
} from './schema';

export const BOUNDARY_DECLARATIONS = [
  'Do not perform OCR.',
  'Do not scan or extract text from images.',
  'Do not classify image content.',
  'Do not infer image semantic category.',
  'Do not choose presets based on image content.'
] as const;

/**
 * Hard Rules (must remain true):
 * 1) Only handles multi-image motion composition.
 * 2) assets.length >= 2.
 * 3) Single-image request is rejected with a redirect message.
 * 4) Never perform OCR.
 * 5) Never scan/extract text from images.
 * 6) Never classify image content.
 * 7) Never infer image semantic category.
 * 8) Never choose presets from visual content.
 * 9) Never fallback to static grid/slideshow/shuffle demo.
 * 10) Presets must define full motionSpec + final composition behavior.
 * 11) Motion must stay frame-driven via Remotion primitives.
 * 12) Output must be deterministic when seed is provided.
 * 13) Preset selection only depends on request metadata.
 * 14) Preset selection must not depend on image content.
 * 15) AI-facing errors must be clear and actionable.
 */
const SINGLE_IMAGE_ERROR =
  'multi-image-motion-skill requires at least 2 images. Use a single-image camera motion skill instead.';

const assertFinitePositiveNumber = (value: number, fieldName: string): void => {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive number.`);
  }
};

export const validateRequest = (request: MultiImageMotionRequest): void => {
  if (request.version !== '1.0') {
    throw new Error("Invalid version. Expected version '1.0'.");
  }

  if (!Array.isArray(request.assets)) {
    throw new Error('assets must be an array.');
  }

  if (request.assets.length < 2) {
    throw new Error(SINGLE_IMAGE_ERROR);
  }

  request.assets.forEach((asset, index) => {
    if (!asset.path || asset.path.trim().length === 0) {
      throw new Error(`assets[${index}].path is required.`);
    }
  });

  if (!isAspectRatio(request.output.aspectRatio)) {
    throw new Error(`Invalid aspectRatio '${String(request.output.aspectRatio)}'.`);
  }

  if (!isUseCase(request.motion.useCase)) {
    throw new Error(`Invalid useCase '${String(request.motion.useCase)}'.`);
  }

  if (request.motion.preset && !isPreset(request.motion.preset)) {
    throw new Error(`Invalid preset '${request.motion.preset}'.`);
  }

  if (request.motion.intensity && !isIntensity(request.motion.intensity)) {
    throw new Error(`Invalid intensity '${request.motion.intensity}'.`);
  }

  if (request.motion.finalComposition && !isFinalComposition(request.motion.finalComposition)) {
    throw new Error(`Invalid finalComposition '${request.motion.finalComposition}'.`);
  }

  if (typeof request.output.durationSeconds !== 'undefined') {
    assertFinitePositiveNumber(request.output.durationSeconds, 'output.durationSeconds');
  }

  if (typeof request.output.fps !== 'undefined') {
    assertFinitePositiveNumber(request.output.fps, 'output.fps');
  }

  if (typeof request.motion.imageHoldSeconds !== 'undefined') {
    assertFinitePositiveNumber(request.motion.imageHoldSeconds, 'motion.imageHoldSeconds');
  }
};

export {SINGLE_IMAGE_ERROR};
