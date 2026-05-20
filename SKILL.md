# Skill Name
image2-remotion-skill

## When to use
Use this skill when the user provides **2 or more images** and wants a creative Remotion video with multi-image motion design.

## When not to use
Do not use this skill for:
- one image
- OCR
- infographic scanning
- document extraction
- image understanding
- content-aware cropping
- product detection
- landscape detection
- ordinary slideshow
- static grid
- single-image camera movement

## Input contract
Input is strict JSON matching `MultiImageMotionRequest` in `src/skill/schema.ts`.

Required:
- `version: "1.0"`
- `assets` (2+)
- `output.aspectRatio`
- `motion.useCase`

Optional:
- `motion.preset`, `motion.intensity`, `motion.imageHoldSeconds`, `motion.finalComposition`
- `text`, `theme`, `render`

## Output contract
Output is a deterministic `NormalizedMultiImageMotionRequest` plus a Remotion composition render path:
- normalized dimensions, fps, duration
- resolved preset
- deterministic seed + debug flags
- frame-driven multi-image animation only
- v1 renderable presets are only:
  - `orbit-ring-intro`
  - `gallery-corridor`
  - `helix-tunnel`
- The other 5 presets are contract placeholders and are not renderable in v1.
- Theme background is constrained to `black` or `transparent`.

## Preset selection rules
1. If `motion.preset` is provided, use it directly.
2. If explicit preset is placeholder, return a clear non-renderable error.
3. Auto-select can only return implemented presets.
4. Otherwise select only from metadata:
   - `useCase`
   - `assets.length`
   - `imageHoldSeconds`
   - `durationSeconds`
   - `aspectRatio`
   - `intensity`
5. Never inspect image visual content.
6. Never use OCR or file-name semantics.

## Hard prohibitions
1. This skill only handles multi-image motion composition.
2. `assets.length` must be `>= 2`.
3. Single-image requests must be rejected and redirected to single-image camera skill.
4. Do not perform OCR.
5. Do not scan/extract text from images.
6. Do not classify image content.
7. Do not infer image semantic category.
8. Do not choose presets based on image content.
9. Do not fallback to static grids/slideshows/shuffle demos.
10. Do not use backgrounds outside `black` and `transparent`.
11. Every preset must define: spatial structure, entrance choreography, camera path, sequencing, transition, final composition.
12. Motion must be frame-driven through Remotion primitives.
13. Deterministic output required when `seed` is provided.
14. Preset selection only depends on allowed metadata.
15. Preset selection must not depend on image visual content.
16. AI-facing errors must be explicit and actionable.

## Error handling
- Invalid version: throw clear version error.
- Invalid enums: throw field-specific errors.
- Invalid numbers (`fps`, `durationSeconds`, `imageHoldSeconds`): throw positive-number error.
- Single-image error message must be exactly:
  `multi-image-motion-skill requires at least 2 images. Use a single-image camera motion skill instead.`

## Examples
- `examples/request-orbit-ring.json`
- `examples/request-gallery-corridor.json`
- `examples/request-helix-tunnel.json`
- `examples/request-invalid-single-image.json`
- `examples/request-auto-select.json`

## Acceptance checklist
- Validate with `docs/acceptance-checklist.md` before claiming completion.
