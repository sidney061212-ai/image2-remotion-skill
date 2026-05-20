# Acceptance Checklist

## General
- [ ] assets.length < 2 is rejected
- [ ] No OCR
- [ ] No image content classification
- [ ] No single-image mode
- [ ] No slideshow fallback
- [ ] All presets have motionSpec
- [ ] All presets have acceptanceCriteria
- [ ] Registry contains exactly 18 presets
- [ ] Implemented presets are exactly 13
- [ ] Placeholder presets are marked non-renderable
- [ ] Normalization is deterministic
- [ ] Tests pass
- [ ] Auto-select returns only implemented presets
- [ ] Explicit placeholder preset returns clear error

## Implemented presets
- [ ] orbit-ring-intro has 3D ring structure
- [ ] gallery-corridor has corridor depth
- [ ] helix-tunnel has helix spatial path
- [ ] corner-deck-pull has top-right stack pull choreography
- [ ] left-rail-preview-focus keeps static rail plus promoted hero image
- [ ] split-panel-compare keeps dual panel comparison rhythm
- [ ] museum-wall-walk has horizontal wall traversal
- [ ] stage-center-spotlight has center-dominant staging
- [ ] accordion-fold-gallery has fold-based depth behavior
- [ ] depth-lane-runway has multi-lane pass-through depth
- [ ] floating-grid-breathe has layered breathing grid
- [ ] book-spread-premium has current/next page staging
- [ ] helix-slow-to-fast has variable speed helix acceleration

## Docs
- [ ] README explains boundaries
- [ ] SKILL.md is AI-facing
- [ ] Examples are valid
- [ ] Placeholder presets are clearly marked

## Hard Rules
1. This skill only handles multi-image motion composition.
2. assets.length must be >= 2.
3. If only one image is provided, reject and suggest single-image camera skill.
4. Do not perform OCR.
5. Do not scan or extract text from images.
6. Do not classify image content.
7. Do not infer image semantics (product/landscape/infographic/portrait/food/document/screenshot/poster).
8. Do not choose presets based on image content.
9. Do not generate ordinary static grids, simple slideshows, or shuffle demos.
10. Every preset must define spatial structure, entrance choreography, camera path, image sequencing, transition behavior, final composition.
11. Motion must be frame-driven through Remotion primitives.
12. Output must be deterministic when seed is provided.
13. Preset selection can only depend on useCase, image count, duration, aspectRatio, intensity, explicit preset.
14. Preset selection must not depend on image visual content.
15. The skill should be AI-facing: clear schema, clear errors, deterministic defaults, predictable output.
