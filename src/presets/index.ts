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
import {CornerDeckPull} from './showcase/CornerDeckPull';
import {LeftRailPreviewFocus} from './showcase/LeftRailPreviewFocus';
import {SplitPanelCompare} from './showcase/SplitPanelCompare';
import {MuseumWallWalk} from './showcase/MuseumWallWalk';
import {AccordionFoldGallery} from './showcase/AccordionFoldGallery';
import {FloatingGridBreathe} from './showcase/FloatingGridBreathe';
import {BookSpreadPremium} from './showcase/BookSpreadPremium';
import {HelixTunnel} from './wow/HelixTunnel';
import {DepthLaneRunway} from './wow/DepthLaneRunway';
import {HelixSlowToFast} from './wow/HelixSlowToFast';
import {StageCenterSpotlight} from './intro/StageCenterSpotlight';

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
  },
  'corner-deck-pull': {
    id: 'corner-deck-pull',
    useCase: 'showcase',
    minImages: 2,
    recommendedImages: {min: 5, max: 14},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.showcase,
    supportsFinalComposition: ['stack', 'main-focus', 'grid'],
    description: 'Premium corner stack reveal where one image is pulled down every sequence beat.',
    implementationStatus: 'implemented',
    isRenderable: true,
    motionSpec: {
      spatialStructure: 'Image cards stay stacked in top-right while one active card travels to center stage.',
      entranceLogic: 'Cards are drawn from the stack with eased pull-down motion and settle in focus zone.',
      cameraPath: 'Subtle push-in with mild yaw to keep stack and stage visible together.',
      imageSequencing: 'One index per timed step; shown cards return to stack order after showcase.',
      transitionBehavior: 'Active card retracts while next card is promoted; final phase converges composition.',
      finalComposition: 'Supports stack/main-focus/grid convergence.'
    },
    acceptanceCriteria: [
      'Top-right stack must stay readable through the sequence.',
      'Each step clearly pulls one card into hero display.',
      'No slideshow dissolve fallback behavior.',
      'Final composition convergence is explicit.'
    ],
    Component: CornerDeckPull
  },
  'left-rail-preview-focus': {
    id: 'left-rail-preview-focus',
    useCase: 'showcase',
    minImages: 2,
    recommendedImages: {min: 4, max: 16},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.showcase,
    supportsFinalComposition: ['main-focus', 'stack', 'title-center'],
    description: 'Fixed left preview rail with one promoted focus image entering and retracting each step.',
    implementationStatus: 'implemented',
    isRenderable: true,
    motionSpec: {
      spatialStructure: 'Static thumbnail rail on the left and a larger focus stage on the right-center.',
      entranceLogic: 'Active card launches from rail into focus zone and returns after hold.',
      cameraPath: 'Gentle push-in with stable framing to preserve rail continuity.',
      imageSequencing: 'Rail order is deterministic; one highlighted thumbnail maps to each active card.',
      transitionBehavior: 'Focus image retracts to rail before next thumbnail activation.',
      finalComposition: 'Supports main-focus/stack/title-center endings.'
    },
    acceptanceCriteria: [
      'Left rail must remain visible and mostly static.',
      'Active image must clearly expand beyond thumbnail scale.',
      'Image transitions cannot become generic fade slideshow.',
      'Final convergence must execute deterministically.'
    ],
    Component: LeftRailPreviewFocus
  },
  'split-panel-compare': {
    id: 'split-panel-compare',
    useCase: 'showcase',
    minImages: 2,
    recommendedImages: {min: 4, max: 20},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.showcase,
    supportsFinalComposition: ['grid', 'main-focus', 'stack'],
    description: 'Alternating left/right dual-panel comparison layout with paired image rhythm.',
    implementationStatus: 'implemented',
    isRenderable: true,
    motionSpec: {
      spatialStructure: 'Two persistent panels arranged left and right with depth separation.',
      entranceLogic: 'Panel images enter from opposing directions and settle as a comparison pair.',
      cameraPath: 'Centered camera with modest forward motion for panel depth.',
      imageSequencing: 'Pairs advance deterministically by index with one pair per sequence step.',
      transitionBehavior: 'Current pair eases out while next pair enters in mirrored motion.',
      finalComposition: 'Supports grid/main-focus/stack convergence.'
    },
    acceptanceCriteria: [
      'Both panels must stay visually present (not sequential fullscreen swaps).',
      'Pair transitions must be mirrored and staged.',
      'No content-aware logic is used for pairing.',
      'Final composition is rendered at end.'
    ],
    Component: SplitPanelCompare
  },
  'museum-wall-walk': {
    id: 'museum-wall-walk',
    useCase: 'showcase',
    minImages: 2,
    recommendedImages: {min: 8, max: 30},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.showcase,
    supportsFinalComposition: ['grid', 'orbit', 'main-focus'],
    description: 'Long gallery wall with camera walk and focus emphasis as images pass center view.',
    implementationStatus: 'implemented',
    isRenderable: true,
    motionSpec: {
      spatialStructure: 'Images are arranged along a continuous horizontal gallery wall.',
      entranceLogic: 'Wall is pre-populated; perceived entrances come from camera traversal.',
      cameraPath: 'Sideways camera walk with subtle depth push and tilt.',
      imageSequencing: 'Focus strength is driven by distance to camera center during traversal.',
      transitionBehavior: 'Walk decelerates and scene transitions into final composition stage.',
      finalComposition: 'Supports grid/orbit/main-focus endings.'
    },
    acceptanceCriteria: [
      'Camera walk should read as museum-like traversal, not carousel.',
      'Near-center cards must visibly gain focus state.',
      'Depth and spacing remain stable across aspect ratios.',
      'Final composition convergence is explicit.'
    ],
    Component: MuseumWallWalk
  },
  'stage-center-spotlight': {
    id: 'stage-center-spotlight',
    useCase: 'intro',
    minImages: 2,
    recommendedImages: {min: 3, max: 14},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.intro,
    supportsFinalComposition: ['main-focus', 'orbit', 'title-center'],
    description: 'Stage-style intro with one hero image center and surrounding ambient ring cards.',
    implementationStatus: 'implemented',
    isRenderable: true,
    motionSpec: {
      spatialStructure: 'One center hero plane with peripheral ring of low-opacity support cards.',
      entranceLogic: 'Hero card pops to front while side cards remain ambient with depth offsets.',
      cameraPath: 'Light push-in and slight top-down tilt to emphasize stage center.',
      imageSequencing: 'Hero index advances by deterministic step timing.',
      transitionBehavior: 'Hero pulses resolve into chosen final composition.',
      finalComposition: 'Supports main-focus/orbit/title-center endings.'
    },
    acceptanceCriteria: [
      'Center hero image must dominate composition.',
      'Peripheral cards remain secondary and spatially distributed.',
      'Animation must remain frame-driven and deterministic.',
      'Final composition appears before clip ends.'
    ],
    Component: StageCenterSpotlight
  },
  'accordion-fold-gallery': {
    id: 'accordion-fold-gallery',
    useCase: 'showcase',
    minImages: 2,
    recommendedImages: {min: 5, max: 24},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.showcase,
    supportsFinalComposition: ['stack', 'main-focus', 'grid'],
    description: 'Accordion-like folding gallery where the active panel opens while neighbors stay angled.',
    implementationStatus: 'implemented',
    isRenderable: true,
    motionSpec: {
      spatialStructure: 'Horizontal card line with fold angles based on distance from active index.',
      entranceLogic: 'All cards exist in folded state while active card opens forward.',
      cameraPath: 'Mild forward camera movement and slight yaw for fold readability.',
      imageSequencing: 'Active index advances in deterministic timed steps.',
      transitionBehavior: 'Opened panel settles back as next panel unfolds.',
      finalComposition: 'Supports stack/main-focus/grid endings.'
    },
    acceptanceCriteria: [
      'Fold geometry must be visible on non-active cards.',
      'Active panel should open with clear scale and depth change.',
      'Must not degrade into simple list pagination.',
      'Final composition convergence is required.'
    ],
    Component: AccordionFoldGallery
  },
  'depth-lane-runway': {
    id: 'depth-lane-runway',
    useCase: 'wow',
    minImages: 2,
    recommendedImages: {min: 9, max: 40},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.wow,
    supportsFinalComposition: ['orbit', 'grid', 'main-focus'],
    description: 'Three-lane depth runway with aggressive pass-by perspective and focus bursts.',
    implementationStatus: 'implemented',
    isRenderable: true,
    motionSpec: {
      spatialStructure: 'Cards are distributed across left/center/right lanes in deep z-space.',
      entranceLogic: 'Lanes are prefilled; camera push creates fast arrivals from depth.',
      cameraPath: 'Strong z push-in with controlled roll to amplify runway energy.',
      imageSequencing: 'Lane assignment follows deterministic index modulo pattern.',
      transitionBehavior: 'Runway momentum decays into final composition stage.',
      finalComposition: 'Supports orbit/grid/main-focus endings.'
    },
    acceptanceCriteria: [
      'Three distinct lanes must remain perceivable.',
      'Near-camera pass-bys must gain focus and scale.',
      'No flat horizontal slideshow behavior.',
      'Final composition is rendered at sequence end.'
    ],
    Component: DepthLaneRunway
  },
  'floating-grid-breathe': {
    id: 'floating-grid-breathe',
    useCase: 'showcase',
    minImages: 2,
    recommendedImages: {min: 8, max: 24},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.showcase,
    supportsFinalComposition: ['grid', 'main-focus', 'orbit'],
    description: 'Layered floating grid with breathing depth motion and rotating active card emphasis.',
    implementationStatus: 'implemented',
    isRenderable: true,
    motionSpec: {
      spatialStructure: 'Grid cards split into z-layers with oscillating offsets.',
      entranceLogic: 'Grid appears established while motion breathing reveals depth rhythm.',
      cameraPath: 'Steady push-in with slight downward perspective.',
      imageSequencing: 'Active highlight rotates by deterministic index timing.',
      transitionBehavior: 'Breathing amplitude reduces before final convergence.',
      finalComposition: 'Supports grid/main-focus/orbit endings.'
    },
    acceptanceCriteria: [
      'Grid must be layered in depth, not static.',
      'Breathing motion should be visible but controlled.',
      'Active card promotion is deterministic.',
      'Final composition convergence is required.'
    ],
    Component: FloatingGridBreathe
  },
  'book-spread-premium': {
    id: 'book-spread-premium',
    useCase: 'showcase',
    minImages: 2,
    recommendedImages: {min: 4, max: 18},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.showcase,
    supportsFinalComposition: ['stack', 'main-focus', 'title-center'],
    description: 'Photo-book spread layout with current hero page and next-page preview transition.',
    implementationStatus: 'implemented',
    isRenderable: true,
    motionSpec: {
      spatialStructure: 'Large current page on left and smaller preview page on right.',
      entranceLogic: 'Current page anchors first while next page enters in supporting position.',
      cameraPath: 'Slow push-in with minimal yaw for editorial look.',
      imageSequencing: 'Current/next indices advance stepwise by deterministic sequence timing.',
      transitionBehavior: 'Outgoing page rotates out while preview page promotes.',
      finalComposition: 'Supports stack/main-focus/title-center endings.'
    },
    acceptanceCriteria: [
      'Primary page must dominate visual hierarchy.',
      'Preview page must remain visible as upcoming content hint.',
      'Transition should read as page turn, not hard cut.',
      'Final composition convergence is required.'
    ],
    Component: BookSpreadPremium
  },
  'helix-slow-to-fast': {
    id: 'helix-slow-to-fast',
    useCase: 'wow',
    minImages: 2,
    recommendedImages: {min: 12, max: 40},
    defaultDurationSeconds: DEFAULT_DURATION_SECONDS_BY_USE_CASE.wow,
    supportsFinalComposition: ['orbit', 'grid', 'main-focus'],
    description: 'Variable-speed helix that ramps from readable entry to high-speed fly-through.',
    implementationStatus: 'implemented',
    isRenderable: true,
    motionSpec: {
      spatialStructure: 'Cards are arranged on a forward helix with continuous rotational offset.',
      entranceLogic: 'Slow initial tunnel entry establishes geometry before acceleration.',
      cameraPath: 'Z push with acceleration curve plus roll and helix spin ramp.',
      imageSequencing: 'Depth order controls pass-by timing and scale changes.',
      transitionBehavior: 'Acceleration eases out and collapses into final composition.',
      finalComposition: 'Supports orbit/grid/main-focus endings.'
    },
    acceptanceCriteria: [
      'Speed profile must clearly shift from slow to fast.',
      'Helix geometry remains visible before and during acceleration.',
      'Depth-driven scale/opacity response is required.',
      'Final composition convergence is explicit.'
    ],
    Component: HelixSlowToFast
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
