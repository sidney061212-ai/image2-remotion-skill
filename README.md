# image2-remotion-skill

An AI-facing Remotion skill for generating creative **multi-image** motion compositions.

## What this skill does
- Takes 2+ images and a motion preset (or auto-select rules).
- Produces a designed video sequence with spatial structure, camera motion, staged choreography, and final composition convergence.
- Uses deterministic defaults and deterministic seed behavior for predictable AI orchestration.
- v1 runtime availability is intentionally limited to 3 implemented presets.

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
10. Every preset must define: spatial structure, entrance choreography, camera path, sequencing, transition, final composition.
11. Motion must be frame-driven by Remotion primitives.
12. Output must be deterministic with `seed`.
13. Preset selection only depends on: useCase, image count, duration, aspectRatio, intensity, explicit preset.
14. Preset selection must not depend on image visual content.
15. AI-facing behavior must be schema-first, error-clear, and predictable.

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

## Preset List (v1)
- `orbit-ring-intro`
- `drop-flip-intro`
- `rotary-fan-intro`
- `magnetic-grid-intro`
- `gallery-corridor`
- `coverflow-focus`
- `page-flip-gallery`
- `helix-tunnel`

## Implemented Presets
These are the only presets that are renderable in v1:
- `orbit-ring-intro`
- `gallery-corridor`
- `helix-tunnel`

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
