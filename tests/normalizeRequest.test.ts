import {describe, expect, test} from 'vitest';
import {normalizeRequest} from '../src/skill/normalizeRequest';
import type {MultiImageMotionRequest} from '../src/skill/schema';
import {OUTRO_NO_RENDERABLE_PRESETS_ERROR} from '../src/skill/selectPreset';

const baseRequest = (): MultiImageMotionRequest => ({
  version: '1.0',
  assets: [
    {path: '/sample/image-01.jpg'},
    {path: '/sample/image-02.jpg'},
    {path: '/sample/image-03.jpg'}
  ],
  output: {aspectRatio: '16:9'},
  motion: {useCase: 'intro'}
});

describe('normalizeRequest', () => {
  test('default fps = 30', () => {
    const normalized = normalizeRequest(baseRequest());
    expect(normalized.output.fps).toBe(30);
  });

  test('default seed = 1', () => {
    const normalized = normalizeRequest(baseRequest());
    expect(normalized.render.seed).toBe(1);
  });

  test('aspectRatio 16:9 => 1920x1080', () => {
    const normalized = normalizeRequest(baseRequest());
    expect(normalized.output.width).toBe(1920);
    expect(normalized.output.height).toBe(1080);
  });

  test('aspectRatio 9:16 => 1080x1920', () => {
    const request = baseRequest();
    request.output.aspectRatio = '9:16';
    const normalized = normalizeRequest(request);
    expect(normalized.output.width).toBe(1080);
    expect(normalized.output.height).toBe(1920);
  });

  test('aspectRatio 1:1 => 1080x1080', () => {
    const request = baseRequest();
    request.output.aspectRatio = '1:1';
    const normalized = normalizeRequest(request);
    expect(normalized.output.width).toBe(1080);
    expect(normalized.output.height).toBe(1080);
  });

  test('preset missing triggers selectPreset', () => {
    const request = baseRequest();
    request.motion.useCase = 'showcase';
    request.assets = Array.from({length: 12}, (_, index) => ({path: `/sample/image-${index + 1}.jpg`}));
    request.motion.imageHoldSeconds = 2.2;

    const normalized = normalizeRequest(request);
    expect(normalized.motion.preset).toBe('gallery-corridor');
  });

  test('same input gives same normalized output', () => {
    const request = baseRequest();
    request.motion.useCase = 'wow';
    request.render = {seed: 99};

    const first = normalizeRequest(request);
    const second = normalizeRequest(request);

    expect(first).toEqual(second);
  });

  test('explicit placeholder preset returns clear error', () => {
    const request = baseRequest();
    request.motion.preset = 'rotary-fan-intro';

    expect(() => normalizeRequest(request)).toThrow(
      "Preset 'rotary-fan-intro' is a preset contract placeholder in v1 and cannot be rendered yet."
    );
  });

  test('useCase outro without explicit preset throws and must not select orbit-ring-intro', () => {
    const request = baseRequest();
    request.motion.useCase = 'outro';
    request.motion.preset = undefined;

    expect(() => normalizeRequest(request)).toThrow(OUTRO_NO_RENDERABLE_PRESETS_ERROR);
  });

  test('explicit mismatched preset/useCase should throw', () => {
    const request = baseRequest();
    request.motion.useCase = 'intro';
    request.motion.preset = 'helix-tunnel';

    expect(() => normalizeRequest(request)).toThrow(
      "Preset 'helix-tunnel' is not valid for useCase 'intro'. Expected a 'intro' preset."
    );
  });

  test('explicit matching implemented preset should pass', () => {
    const request = baseRequest();
    request.motion.useCase = 'showcase';
    request.motion.preset = 'gallery-corridor';
    request.assets = Array.from({length: 10}, (_, index) => ({path: `/sample/image-${index + 1}.jpg`}));

    const normalized = normalizeRequest(request);
    expect(normalized.motion.preset).toBe('gallery-corridor');
  });
});
