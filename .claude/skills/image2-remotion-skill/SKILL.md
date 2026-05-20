```markdown
# image2-remotion-skill Development Patterns

> Auto-generated skill from repository analysis

## Overview
This repository implements a TypeScript/React skill for image-to-video rendering using Remotion. It provides a modular preset system, request normalization and validation logic, and a robust testing suite. The codebase emphasizes maintainability through clear coding conventions, modular workflows, and comprehensive documentation.

## Coding Conventions

- **File Naming:**  
  Use `camelCase` for filenames.  
  _Example:_  
  ```
  src/skill/normalizeRequest.ts
  src/presets/presetRegistry.ts
  ```

- **Import Style:**  
  Use relative imports for all modules.  
  _Example:_  
  ```ts
  import { validateRequest } from './validateRequest';
  import { Preset } from '../presets/types';
  ```

- **Export Style:**  
  Use named exports only.  
  _Example:_  
  ```ts
  // Good
  export function selectPreset(...) { ... }

  // Avoid
  // export default function selectPreset(...) { ... }
  ```

- **Commit Messages:**  
  Follow [Conventional Commits](https://www.conventionalcommits.org/) with `fix` and `feat` prefixes.  
  _Example:_  
  ```
  feat: add validation for blocked presets
  fix: correct use-case matching logic in selectPreset
  ```

## Workflows

### Preset Selection Logic Update
**Trigger:** When someone needs to change how presets are selected or validated (e.g., blocking placeholder or outro presets, enforcing use-case constraints).  
**Command:** `/update-preset-selection`

1. **Update selection and validation logic:**
   - Edit `src/skill/normalizeRequest.ts` and `src/skill/selectPreset.ts` to reflect new selection or validation rules.
   - _Example:_
     ```ts
     // src/skill/selectPreset.ts
     if (preset.type === 'placeholder' || preset.type === 'outro') {
       throw new Error('Preset type not allowed');
     }
     ```
2. **Update related validation logic:**
   - Modify or extend logic in `src/skill/validateRequest.ts` as needed.
3. **Update preset type definitions:**
   - Adjust types in `src/presets/types.ts` if preset structure or allowed values change.
4. **Update preset registry:**
   - Edit `src/presets/index.ts` to add, remove, or modify available presets.
5. **Update or add related tests:**
   - Ensure coverage in:
     - `tests/normalizeRequest.test.ts`
     - `tests/selectPreset.test.ts`
     - `tests/presetRegistry.test.ts`
     - `tests/validateRequest.test.ts`
   - _Example:_
     ```ts
     // tests/selectPreset.test.ts
     it('blocks placeholder presets', () => {
       expect(() => selectPreset({ type: 'placeholder' })).toThrow();
     });
     ```
6. **Update documentation:**
   - Reflect any behavior changes in:
     - `README.md`
     - `SKILL.md`
     - `docs/acceptance-checklist.md`
     - `docs/preset-contract.md`
     - `docs/ai-usage.md`

## Testing Patterns

- **Framework:**  
  Uses [vitest](https://vitest.dev/) for all unit and integration tests.

- **Test File Pattern:**  
  Test files are named with `.test.ts` suffix and placed in the `tests/` directory.  
  _Example:_  
  ```
  tests/normalizeRequest.test.ts
  tests/selectPreset.test.ts
  ```

- **Test Example:**  
  ```ts
  import { describe, it, expect } from 'vitest';
  import { validateRequest } from '../src/skill/validateRequest';

  describe('validateRequest', () => {
    it('should reject invalid presets', () => {
      expect(() => validateRequest({ preset: 'invalid' })).toThrow();
    });
  });
  ```

## Commands

| Command                  | Purpose                                                      |
|--------------------------|--------------------------------------------------------------|
| /update-preset-selection | Update logic for preset selection and validation workflows   |
```
