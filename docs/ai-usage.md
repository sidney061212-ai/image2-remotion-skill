# AI Usage Flow

Step 1:
Validate request.

Step 2:
Normalize defaults.

Step 3:
Select preset.
- Auto-select only from implemented presets.
- Reject explicit placeholder presets with a clear error.

Step 4:
Generate motion plan.

Step 5:
Render Remotion composition.

Step 6:
Run acceptance checklist.

Guardrails:
- Do not inspect image content.
- Do not OCR.
- Do not classify image type.
- Do not fallback to slideshow.
