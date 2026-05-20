import {DEFAULT_DURATION_SECONDS_BY_USE_CASE} from '../skill/defaults';
import type {MultiImageMotionPreset} from '../skill/schema';
import type {MultiImagePresetDefinition} from './types';
import {DropFlipIntroPlaceholder} from './intro/DropFlipIntro.placeholder';
import {MagneticGridIntroPlaceholder} from './intro/MagneticGridIntro.placeholder';
import {OrbitRingIntro} from './intro/OrbitRingIntro';
import {RotaryFanIntroPlaceholder} from './intro/RotaryFanIntro.placeholder';
import {CoverflowFocusPlaceholder} from './showcase/CoverflowFocus.placeholder';
import {GalleryCorridor} from './showcase/GalleryCorridor';
import {PageFlipGalleryPlaceholder} from './showcase/PageFlipGallery.placeholder';
import {HelixTunnel} from './wow/HelixTunnel';

export const presetRegistry: Record<MultiImageMotionPreset, MultiImagePresetDefinition> = {
  'orbit-ring-intro': {
    id: 'orbit-ring-intro',
    useCase: 'intro',
    minImages: 2,
    recommendedImages: {min: 6, max: 18},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.intro,
    supportsFinalComposition: ['title-center', 'orbit', 'main-focus'],
    description: '3D orbit ring intro with central title reveal and spatial image choreography.',
    implementationStatus: 'implemented',
    isRenderable: true,
    motionSpec: {
      spatialStructure: 'Images are distributed on a 3D ring around a reserved center area.',
      entranceLogic: 'Images fly in from deep z-space and then attach to ring anchors in a staggered sequence.',
      cameraPath: 'Camera pushes from far to medium, with subtle yaw stabilization and ring rotation.',
      imageSequencing: 'Staggered attachment around ring index; smaller sets still maintain closed loop layout.',
      transitionBehavior: 'Ring slows near the end while title and subtitle reveal in center.',
      finalComposition: 'Transitions into title-center / orbit / main-focus final state.'
    },
    acceptanceCriteria: [
      'Visual result must read as a 3D image ring, not a flat circular collage.',
      'Includes z-depth, scale variance, and rotateY per image.',
      'Center area remains legible for title content.',
      'Supports low image counts (2-4) with stable mini-ring arrangement.',
      'All animation is frame-driven with Remotion primitives.',
      'Runs in 16:9, 9:16, and 1:1.'
    ],
    Component: OrbitRingIntro
  },
  'drop-flip-intro': {
    id: 'drop-flip-intro',
    useCase: 'intro',
    minImages: 2,
    recommendedImages: {min: 4, max: 12},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.intro,
    supportsFinalComposition: ['title-center', 'stack', 'main-focus'],
    description: 'Planned intro where cards drop in, flip, and settle into a cinematic arrangement.',
    implementationStatus: 'placeholder',
    isRenderable: false,
    motionSpec: {
      spatialStructure: 'Layered vertical lanes with depth-separated card anchors.',
      entranceLogic: 'Cards drop from off-screen, flip across X axis, and lock into perspective staging.',
      cameraPath: 'Short push-in with slight downward tilt correction.',
      imageSequencing: 'Alternating lane assignment with deterministic stagger order.',
      transitionBehavior: 'Flip velocity decays before final lock-in transition.',
      finalComposition: 'Collapses into title-center or stack final composition.'
    },
    acceptanceCriteria: [
      'Must preserve clear multi-layer depth during card drop.',
      'Flip cadence must be staggered and deterministic by seed.',
      'Cannot degrade to plain slide-in cards.',
      'Final frame must enter a defined final composition.'
    ],
    Component: DropFlipIntroPlaceholder
  },
  'rotary-fan-intro': {
    id: 'rotary-fan-intro',
    useCase: 'intro',
    minImages: 2,
    recommendedImages: {min: 3, max: 8},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.intro,
    supportsFinalComposition: ['title-center', 'orbit', 'stack'],
    description: 'Planned intro where image cards fan out with rotational staging and center emphasis.',
    implementationStatus: 'placeholder',
    isRenderable: false,
    motionSpec: {
      spatialStructure: 'Cards arranged in an arc fan with depth offsets.',
      entranceLogic: 'Fan opens from compact stack into wide angular spread.',
      cameraPath: 'Micro pan and push with eased settle.',
      imageSequencing: 'Deterministic index-based fan angles and release timing.',
      transitionBehavior: 'Fan closes slightly before final composition snap.',
      finalComposition: 'Resolves to title-center, orbit, or stack.'
    },
    acceptanceCriteria: [
      'Fan shape must be visually explicit and not grid-like.',
      'Depth layering must remain visible through the spread.',
      'Animation must be frame-driven and deterministic.',
      'Ending must converge into a supported final composition.'
    ],
    Component: RotaryFanIntroPlaceholder
  },
  'magnetic-grid-intro': {
    id: 'magnetic-grid-intro',
    useCase: 'intro',
    minImages: 2,
    recommendedImages: {min: 10, max: 30},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.intro,
    supportsFinalComposition: ['title-center', 'grid', 'main-focus'],
    description: 'Planned intro with magnetized multi-plane grid attraction and kinetic alignment.',
    implementationStatus: 'placeholder',
    isRenderable: false,
    motionSpec: {
      spatialStructure: 'Multi-plane grid layers with varying z-depth strata.',
      entranceLogic: 'Cards drift in asynchronously then snap to magnetic grid anchors.',
      cameraPath: 'Wide view to medium push with slight lateral drift.',
      imageSequencing: 'Anchor fill order follows deterministic radial expansion.',
      transitionBehavior: 'Grid energy decays before compositional convergence.',
      finalComposition: 'Converges into title-center, grid, or main-focus.'
    },
    acceptanceCriteria: [
      'Must show magnetic snap behavior, not static grid reveal.',
      'Depth strata must be perceivable across layers.',
      'No shuffle slideshow behavior is allowed.',
      'Final state must converge to declared final composition.'
    ],
    Component: MagneticGridIntroPlaceholder
  },
  'gallery-corridor': {
    id: 'gallery-corridor',
    useCase: 'showcase',
    minImages: 2,
    recommendedImages: {min: 8, max: 30},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.showcase,
    supportsFinalComposition: ['main-focus', 'grid', 'orbit', 'title-center'],
    description: '3D corridor showcase with forward camera travel and per-image focus states.',
    implementationStatus: 'implemented',
    isRenderable: true,
    motionSpec: {
      spatialStructure: 'Left/right wall cards define a deep perspective corridor with z-axis travel.',
      entranceLogic: 'Cards start pre-positioned in corridor depth and are revealed through camera traversal.',
      cameraPath: 'Continuous forward push-in with subtle sway and yaw drift.',
      imageSequencing: 'Focus state follows relative depth crossing near camera center.',
      transitionBehavior: 'Corridor dims and folds into a final composition phase.',
      finalComposition: 'Supports main-focus, grid, orbit, and title-center convergence.'
    },
    acceptanceCriteria: [
      'Corridor depth and side walls are clearly visible.',
      'Not equivalent to horizontal carousel motion.',
      'Passing images gain temporary focus/highlight state.',
      'Ending includes explicit final composition convergence.',
      'Supports 16:9, 9:16, and 1:1.'
    ],
    Component: GalleryCorridor
  },
  'coverflow-focus': {
    id: 'coverflow-focus',
    useCase: 'showcase',
    minImages: 2,
    recommendedImages: {min: 5, max: 20},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.showcase,
    supportsFinalComposition: ['main-focus', 'stack', 'title-center'],
    description: 'Planned showcase with coverflow staging and focal transitions.',
    implementationStatus: 'placeholder',
    isRenderable: false,
    motionSpec: {
      spatialStructure: 'Central focus plane with angled side cards in depth.',
      entranceLogic: 'Cards slide from depth into coverflow lanes.',
      cameraPath: 'Stable camera with short focal push oscillations.',
      imageSequencing: 'Current focus index advances deterministically.',
      transitionBehavior: 'Side lanes compress before final composition merge.',
      finalComposition: 'Resolves into main-focus, stack, or title-center.'
    },
    acceptanceCriteria: [
      'Must keep an explicit central focus plane.',
      'Side cards should remain angled and depth-separated.',
      'Cannot degrade into simple slideshow pagination.',
      'Final convergence must be defined and deterministic.'
    ],
    Component: CoverflowFocusPlaceholder
  },
  'page-flip-gallery': {
    id: 'page-flip-gallery',
    useCase: 'showcase',
    minImages: 2,
    recommendedImages: {min: 4, max: 18},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.showcase,
    supportsFinalComposition: ['stack', 'main-focus', 'grid'],
    description: 'Planned showcase with page-turn choreography and layered gallery transitions.',
    implementationStatus: 'placeholder',
    isRenderable: false,
    motionSpec: {
      spatialStructure: 'Layered page stack with hinge-based flip axis.',
      entranceLogic: 'Pages enter depth stack and flip forward one by one.',
      cameraPath: 'Fixed camera with subtle tilt to emphasize page depth.',
      imageSequencing: 'Flip order follows deterministic index sequencing.',
      transitionBehavior: 'Final flips collapse into a selected composition mode.',
      finalComposition: 'Supports stack, main-focus, and grid ending states.'
    },
    acceptanceCriteria: [
      'Page hinge behavior must be obvious in final implementation.',
      'Cards must maintain depth hierarchy during flips.',
      'Must not become a flat dissolve slideshow.',
      'Final convergence behavior is required.'
    ],
    Component: PageFlipGalleryPlaceholder
  },
  'helix-tunnel': {
    id: 'helix-tunnel',
    useCase: 'wow',
    minImages: 2,
    recommendedImages: {min: 10, max: 40},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.wow,
    supportsFinalComposition: ['orbit', 'grid', 'title-center', 'main-focus'],
    description: 'High-impact helix tunnel fly-through with depth scaling and rotational camera energy.',
    implementationStatus: 'implemented',
    isRenderable: true,
    motionSpec: {
      spatialStructure: 'Images are distributed along a forward helix tunnel path.',
      entranceLogic: 'Helix is prebuilt and camera rapidly enters tunnel centerline.',
      cameraPath: 'Strong push-in along z-axis with controlled roll and continuous helix spin.',
      imageSequencing: 'Depth-based pass-by order drives perceived speed and scale shifts.',
      transitionBehavior: 'Tunnel energy decays into a controlled final composition collapse.',
      finalComposition: 'Supports orbit, grid, title-center, and main-focus endings.'
    },
    acceptanceCriteria: [
      'Helix structure is unmistakable; not just circular spin.',
      'High-speed pass-by sensation must be present.',
      'Image scale responds to z-depth progression.',
      'Ending converges into final composition mode.',
      'Supports 16:9, 9:16, and 1:1.'
    ],
    Component: HelixTunnel
  }
};

export const getPresetDefinition = (preset: MultiImageMotionPreset): MultiImagePresetDefinition => {
  const definition = presetRegistry[preset];

  if (!definition) {
    throw new Error(`Unknown preset '${preset}'. Check src/presets/index.ts registry.`);
  }

  return definition;
};

export const getPresetDefinitionsByStatus = (
  status: MultiImagePresetDefinition['implementationStatus']
): MultiImagePresetDefinition[] => {
  return Object.values(presetRegistry).filter((preset) => preset.implementationStatus === status);
};

export const getImplementedPresetIds = (): MultiImageMotionPreset[] => {
  return getPresetDefinitionsByStatus('implemented').map((preset) => preset.id);
};

export const getRenderablePresetIds = (): MultiImageMotionPreset[] => {
  return Object.values(presetRegistry)
    .filter((preset) => preset.isRenderable)
    .map((preset) => preset.id);
};

export const assertRenderablePreset = (preset: MultiImageMotionPreset): void => {
  const definition = getPresetDefinition(preset);

  if (!definition.isRenderable) {
    const implementedList = getImplementedPresetIds().join(', ');
    throw new Error(
      `Preset '${preset}' is a preset contract placeholder in v1 and cannot be rendered yet. Use one of implemented presets: ${implementedList}.`
    );
  }
};
