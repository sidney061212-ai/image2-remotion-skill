# image2-remotion-skill

An AI-facing Remotion skill for generating creative **multi-image** motion compositions.

## What this skill does
- Takes 2+ images and a motion preset (or auto-select rules).
- Produces a designed video sequence with spatial structure, camera motion, staged choreography, and final composition convergence.
- Uses deterministic defaults and deterministic seed behavior for predictable AI orchestration.
- Background is intentionally constrained to only `black` or `transparent`.

## What this skill does not do
- OCR or text extraction from images.
- Image content understanding or classification.
- Single-image camera moves.
- Generic static grid demos.
- Generic slideshow/shuffle fallback.

This project intentionally avoids OCR, image classification, infographic parsing, single-image camera motion, and generic slideshow generation.

## Hard Rules
1. This skill only handles multi-image motion composition.
2. `assets.length` must be `>= 2`.
3. Single-image requests are rejected with: `multi-image-motion-skill requires at least 2 images. Use a single-image camera motion skill instead.`
4. Do not perform OCR.
5. Do not scan/extract text from images.
6. Do not classify image content.
7. Do not infer whether an image is product/landscape/infographic/portrait/food/document/screenshot/poster.
8. Do not choose presets from image content.
9. Do not fallback to static grids/slideshows/shuffle demos.
10. Background options are only `black` and `transparent`.
11. Every preset must define: spatial structure, entrance choreography, camera path, sequencing, transition, final composition.
12. Motion must be frame-driven by Remotion primitives.
13. Output must be deterministic with `seed`.
14. Preset selection only depends on: useCase, image count, duration, aspectRatio, intensity, explicit preset.
15. Preset selection must not depend on image visual content.
16. AI-facing behavior must be schema-first, error-clear, and predictable.

## Install
```bash
npm install
```

## Run
```bash
npm run dev
npm run build
```

## Render
```bash
npm run render:orbit
npm run render:corridor
npm run render:helix
npm run render:corner-deck
npm run render:left-rail
npm run render:split-panel
npm run render:museum-wall
npm run render:stage-spotlight
npm run render:accordion
npm run render:depth-runway
npm run render:floating-grid
npm run render:book-spread
npm run render:helix-slow-fast
```

Notes:
- Example files use `/sample/image-xx.png` placeholders. Replace them with real files in Remotion `public/sample/` (or remote URLs).
- Current scripts pass JSON file path through `--props`. If your Remotion CLI requires raw JSON, use:
  - `remotion render src/index.ts Image2RemotionSkill out/test.mp4 --props="$(cat examples/request-orbit-ring.json)"`

## Example Requests
- `examples/request-orbit-ring.json`
- `examples/request-gallery-corridor.json`
- `examples/request-helix-tunnel.json`
- `examples/request-invalid-single-image.json`
- `examples/request-auto-select.json`
- `examples/request-corner-deck-pull.json`
- `examples/request-left-rail-preview-focus.json`
- `examples/request-split-panel-compare.json`
- `examples/request-museum-wall-walk.json`
- `examples/request-stage-center-spotlight.json`
- `examples/request-accordion-fold-gallery.json`
- `examples/request-depth-lane-runway.json`
- `examples/request-floating-grid-breathe.json`
- `examples/request-book-spread-premium.json`
- `examples/request-helix-slow-to-fast.json`

## Preset List (v1)
- `orbit-ring-intro`
- `drop-flip-intro`
- `rotary-fan-intro`
- `magnetic-grid-intro`
- `gallery-corridor`
- `coverflow-focus`
- `page-flip-gallery`
- `helix-tunnel`
- `corner-deck-pull`
- `left-rail-preview-focus`
- `split-panel-compare`
- `museum-wall-walk`
- `stage-center-spotlight`
- `accordion-fold-gallery`
- `depth-lane-runway`
- `floating-grid-breathe`
- `book-spread-premium`
- `helix-slow-to-fast`

## Implemented Presets
Renderable presets:
- `orbit-ring-intro`
- `gallery-corridor`
- `helix-tunnel`
- `corner-deck-pull`
- `left-rail-preview-focus`
- `split-panel-compare`
- `museum-wall-walk`
- `stage-center-spotlight`
- `accordion-fold-gallery`
- `depth-lane-runway`
- `floating-grid-breathe`
- `book-spread-premium`
- `helix-slow-to-fast`

## Placeholder Presets
These are preset-contract placeholders in v1 and are intentionally **not renderable**:
- `drop-flip-intro`
- `rotary-fan-intro`
- `magnetic-grid-intro`
- `coverflow-focus`
- `page-flip-gallery`

If an explicit placeholder preset is requested, the skill returns a clear error instead of rendering a fallback demo.

## Test
```bash
npm run test
```

## Desktop Preview Frames
Preview frames generated from real desktop images are included for review:
- `previews/desktop-real/corner-deck-pull.png`
- `previews/desktop-real/left-rail-preview-focus.png`
- `previews/desktop-real/split-panel-compare.png`
- `previews/desktop-real/museum-wall-walk.png`
- `previews/desktop-real/stage-center-spotlight.png`
- `previews/desktop-real/accordion-fold-gallery.png`
- `previews/desktop-real/depth-lane-runway.png`
- `previews/desktop-real/floating-grid-breathe.png`
- `previews/desktop-real/book-spread-premium.png`
- `previews/desktop-real/helix-slow-to-fast.png`

## AI Usage
1. Validate request.
2. Normalize defaults.
3. Select preset by metadata-only rules.
4. Render motion plan using preset contract.
5. Render Remotion composition.
6. Run acceptance checklist.

See [docs/ai-usage.md](./docs/ai-usage.md).

## Reviewer Checklist
See [docs/acceptance-checklist.md](./docs/acceptance-checklist.md). Recommended first-pass files:
- `src/skill/schema.ts`
- `src/skill/validateRequest.ts`
- `src/skill/normalizeRequest.ts`
- `src/skill/selectPreset.ts`
- `src/presets/index.ts`
- `src/presets/intro/OrbitRingIntro.tsx`
- `src/presets/showcase/GalleryCorridor.tsx`
- `src/presets/wow/HelixTunnel.tsx`
- `tests/*.test.ts`
