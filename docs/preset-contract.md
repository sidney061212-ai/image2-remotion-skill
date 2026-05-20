# Preset Contract

Every preset must define:
1. `spatialStructure`
2. `entranceLogic`
3. `cameraPath`
4. `imageSequencing`
5. `transitionBehavior`
6. `finalComposition`
7. `acceptanceCriteria`

A preset is not accepted if it only fades, slides, shuffles, or displays a static grid.

Contract source type:
- `src/presets/types.ts` (`MultiImagePresetDefinition`)

Registry:
- `src/presets/index.ts`
