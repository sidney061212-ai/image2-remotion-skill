import {describe, expect, test} from 'vitest';
import type {MultiImageMotionRequest} from '../src/skill/schema';
import {validateRequest} from '../src/skill/validateRequest';

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
});
