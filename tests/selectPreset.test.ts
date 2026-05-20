import {describe, expect, test} from 'vitest';
import type {MultiImageMotionRequest} from '../src/skill/schema';
import {selectPreset} from '../src/skill/selectPreset';

const makeRequest = (): MultiImageMotionRequest => ({
  version: '1.0',
  assets: [{path: '/sample/1.jpg'}, {path: '/sample/2.jpg'}],
  output: {aspectRatio: '16:9'},
  motion: {useCase: 'intro'}
});

describe('selectPreset', () => {
  test('explicit preset wins', () => {
    const request = makeRequest();
    request.motion.preset = 'helix-tunnel';
    expect(selectPreset(request)).toBe('helix-tunnel');
  });

  test('intro <= 6 returns rotary-fan-intro', () => {
    const request = makeRequest();
    request.assets = Array.from({length: 6}, (_, i) => ({path: `/sample/${i}.jpg`}));
    expect(selectPreset(request)).toBe('rotary-fan-intro');
  });

  test('intro <= 12 returns orbit-ring-intro', () => {
    const request = makeRequest();
    request.assets = Array.from({length: 9}, (_, i) => ({path: `/sample/${i}.jpg`}));
    expect(selectPreset(request)).toBe('orbit-ring-intro');
  });

  test('intro > 12 returns magnetic-grid-intro', () => {
    const request = makeRequest();
    request.assets = Array.from({length: 13}, (_, i) => ({path: `/sample/${i}.jpg`}));
    expect(selectPreset(request)).toBe('magnetic-grid-intro');
  });

  test('showcase with hold >= 3 returns coverflow-focus', () => {
    const request = makeRequest();
    request.motion.useCase = 'showcase';
    request.motion.imageHoldSeconds = 3;
    expect(selectPreset(request)).toBe('coverflow-focus');
  });

  test('showcase count >= 10 returns gallery-corridor', () => {
    const request = makeRequest();
    request.motion.useCase = 'showcase';
    request.motion.imageHoldSeconds = 2.2;
    request.assets = Array.from({length: 10}, (_, i) => ({path: `/sample/${i}.jpg`}));
    expect(selectPreset(request)).toBe('gallery-corridor');
  });

  test('wow returns helix-tunnel', () => {
    const request = makeRequest();
    request.motion.useCase = 'wow';
    request.assets = Array.from({length: 20}, (_, i) => ({path: `/sample/${i}.jpg`}));
    expect(selectPreset(request)).toBe('helix-tunnel');
  });

  test('selection does not inspect image path content', () => {
    const a = makeRequest();
    const b = makeRequest();
    a.motion.useCase = 'showcase';
    b.motion.useCase = 'showcase';
    a.assets = Array.from({length: 10}, (_, i) => ({path: `/sample/product-${i}.jpg`}));
    b.assets = Array.from({length: 10}, (_, i) => ({path: `/sample/landscape-${i}.jpg`}));

    expect(selectPreset(a)).toBe(selectPreset(b));
  });
});
