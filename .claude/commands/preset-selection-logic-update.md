---
name: preset-selection-logic-update
description: Workflow command scaffold for preset-selection-logic-update in image2-remotion-skill.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /preset-selection-logic-update

Use this workflow when working on **preset-selection-logic-update** in `image2-remotion-skill`.

## Goal

Update the logic for preset selection and validation, including blocking certain presets and enforcing use-case matches.

## Common Files

- `src/skill/normalizeRequest.ts`
- `src/skill/selectPreset.ts`
- `src/skill/validateRequest.ts`
- `src/presets/types.ts`
- `src/presets/index.ts`
- `tests/normalizeRequest.test.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update selection and validation logic in src/skill/normalizeRequest.ts and src/skill/selectPreset.ts
- Update or add related validation logic in src/skill/validateRequest.ts
- Update preset type definitions if necessary in src/presets/types.ts
- Update preset registry in src/presets/index.ts if preset availability changes
- Update or add related tests in tests/normalizeRequest.test.ts, tests/selectPreset.test.ts, tests/presetRegistry.test.ts, tests/validateRequest.test.ts

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.