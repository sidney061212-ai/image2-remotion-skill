import {describe, expect, test} from 'vitest';
import type {MultiImageMotionRequest} from '../src/skill/schema';
import {BOUNDARY_DECLARATIONS, validateRequest} from '../src/skill/validateRequest';

const makeValidRequest = (): MultiImageMotionRequest => ({
  version: '1.0',
  assets: [{path: '/sample/image-01.jpg'}, {path: '/sample/image-02.jpg'}],
  output: {aspectRatio: '16:9'},
  motion: {useCase: 'intro'}
});

describe('validateRequest', () => {
  test('valid request pass', () => {
    expect(() => validateRequest(makeValidRequest())).not.toThrow();
  });

  test('one image reject', () => {
    const request = makeValidRequest();
    request.assets = [{path: '/sample/one.jpg'}];

    expect(() => validateRequest(request)).toThrow(
      'multi-image-motion-skill requires at least 2 images. Use a single-image camera motion skill instead.'
    );
  });

  test('missing asset path reject', () => {
    const request = makeValidRequest();
    request.assets = [{path: '/sample/a.jpg'}, {path: ''}];

    expect(() => validateRequest(request)).toThrow('assets[1].path is required.');
  });

  test('invalid useCase reject', () => {
    const request = makeValidRequest();
    request.motion.useCase = 'invalid' as MultiImageMotionRequest['motion']['useCase'];

    expect(() => validateRequest(request)).toThrow("Invalid useCase 'invalid'.");
  });

  test('invalid preset reject', () => {
    const request = makeValidRequest();
    request.motion.preset = 'bad-preset' as MultiImageMotionRequest['motion']['preset'];

    expect(() => validateRequest(request)).toThrow("Invalid preset 'bad-preset'.");
  });

  test('invalid fps reject', () => {
    const request = makeValidRequest();
    request.output.fps = 0;

    expect(() => validateRequest(request)).toThrow('output.fps must be a positive number.');
  });

  test('invalid duration reject', () => {
    const request = makeValidRequest();
    request.output.durationSeconds = -1;

    expect(() => validateRequest(request)).toThrow('output.durationSeconds must be a positive number.');
  });

  test('boundary declarations include no OCR and no image understanding', () => {
    expect(BOUNDARY_DECLARATIONS).toContain('Do not perform OCR.');
    expect(BOUNDARY_DECLARATIONS).toContain('Do not classify image content.');
  });

  test('theme background allows black and transparent only', () => {
    const black = makeValidRequest();
    black.theme = {background: 'black'};
    expect(() => validateRequest(black)).not.toThrow();

    const transparent = makeValidRequest();
    transparent.theme = {background: 'transparent'};
    expect(() => validateRequest(transparent)).not.toThrow();

    const invalid = makeValidRequest();
    invalid.theme = {background: 'dark-gradient' as never};
    expect(() => validateRequest(invalid)).toThrow(
      "Invalid theme.background 'dark-gradient'. Allowed values: black, transparent."
    );
  });
});
