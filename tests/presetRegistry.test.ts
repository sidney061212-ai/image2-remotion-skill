import {describe, expect, test} from 'vitest';
import {getPresetDefinition, presetRegistry} from '../src/presets';

describe('presetRegistry', () => {
  test('registry has 8 presets', () => {
    expect(Object.keys(presetRegistry)).toHaveLength(8);
  });

  test('each preset has motionSpec', () => {
    Object.values(presetRegistry).forEach((preset) => {
      expect(preset.motionSpec.spatialStructure.length).toBeGreaterThan(0);
      expect(preset.motionSpec.entranceLogic.length).toBeGreaterThan(0);
      expect(preset.motionSpec.cameraPath.length).toBeGreaterThan(0);
      expect(preset.motionSpec.imageSequencing.length).toBeGreaterThan(0);
      expect(preset.motionSpec.transitionBehavior.length).toBeGreaterThan(0);
      expect(preset.motionSpec.finalComposition.length).toBeGreaterThan(0);
    });
  });

  test('each preset has acceptanceCriteria', () => {
    Object.values(presetRegistry).forEach((preset) => {
      expect(preset.acceptanceCriteria.length).toBeGreaterThan(0);
    });
  });

  test('implemented presets are marked implemented', () => {
    const implemented = Object.values(presetRegistry)
      .filter((preset) => preset.implementationStatus === 'implemented')
      .map((preset) => preset.id)
      .sort();

    expect(implemented).toEqual(['gallery-corridor', 'helix-tunnel', 'orbit-ring-intro']);
  });

  test('implemented presets are exactly 3', () => {
    const implementedCount = Object.values(presetRegistry).filter(
      (preset) => preset.implementationStatus === 'implemented'
    ).length;

    expect(implementedCount).toBe(3);
  });

  test('placeholder presets are marked placeholder', () => {
    const placeholders = Object.values(presetRegistry)
      .filter((preset) => preset.implementationStatus === 'placeholder')
      .map((preset) => preset.id)
      .sort();

    expect(placeholders).toEqual([
      'coverflow-focus',
      'drop-flip-intro',
      'magnetic-grid-intro',
      'page-flip-gallery',
      'rotary-fan-intro'
    ]);
  });

  test('placeholder presets are marked non-renderable', () => {
    Object.values(presetRegistry)
      .filter((preset) => preset.implementationStatus === 'placeholder')
      .forEach((preset) => {
        expect(preset.isRenderable).toBe(false);
      });
  });

  test('status value is from implemented/placeholder/experimental', () => {
    Object.values(presetRegistry).forEach((preset) => {
      expect(['implemented', 'placeholder', 'experimental']).toContain(preset.implementationStatus);
    });
  });

  test('getPresetDefinition throws on invalid id', () => {
    expect(() => getPresetDefinition('not-exist' as unknown as never)).toThrow(
      "Unknown preset 'not-exist'. Check src/presets/index.ts registry."
    );
  });
});
