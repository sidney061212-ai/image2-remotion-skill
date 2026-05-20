import {AbsoluteFill} from 'remotion';
import {normalizeRequest} from '../skill/normalizeRequest';
import type {MultiImageMotionRequest} from '../skill/schema';
import {getPresetDefinition} from '../presets';

export const MultiImageComposition: React.FC<MultiImageMotionRequest> = (request) => {
  const normalized = normalizeRequest(request);
  const preset = getPresetDefinition(normalized.motion.preset);
  const durationInFrames = Math.round(normalized.output.durationSeconds * normalized.output.fps);

  return (
    <AbsoluteFill>
      <preset.Component
        assets={normalized.assets}
        width={normalized.output.width}
        height={normalized.output.height}
        fps={normalized.output.fps}
        durationInFrames={durationInFrames}
        intensity={normalized.motion.intensity}
        imageHoldSeconds={normalized.motion.imageHoldSeconds}
        finalComposition={normalized.motion.finalComposition}
        text={normalized.text}
        theme={normalized.theme}
        seed={normalized.render.seed}
        debug={normalized.render.debug}
      />
    </AbsoluteFill>
  );
};
