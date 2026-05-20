import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
import {phaseProgress} from '../../motion/timeline';
import {getStepState, resolveStepFrames} from '../shared/sequence';
import type {MultiImagePresetProps} from '../types';

export const AccordionFoldGallery: React.FC<MultiImagePresetProps> = ({
  assets,
  width,
  height,
  imageHoldSeconds,
  theme,
  finalComposition,
  text,
  seed,
  debug
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();

  // Script: folded accordion cards; active panel opens while neighbors stay angled.
  const stepFrames = resolveStepFrames(fps, imageHoldSeconds, 4.2);
  const sequence = getStepState(frame, assets.length, stepFrames);
  const finalStart = Math.min(durationInFrames - 1, Math.max(sequence.totalFrames - Math.floor(fps * 0.8), Math.floor(durationInFrames * 0.84)));
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const cardWidth = Math.min(width, height) * 0.24;
  const cardHeight = cardWidth * 0.66;
  const spread = Math.min(width, height) * 0.2;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(0px, 0px, ${interpolate(phaseProgress(frame, 0, durationInFrames - 1), [0, 1], [-460, -210])}px) rotateY(-3deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.02, 0.14])}
    >
      {assets.map((asset, index) => {
        const delta = index - sequence.stepIndex;
        const distance = Math.abs(delta);
        const angle = delta < 0 ? 52 : delta > 0 ? -52 : 0;
        const x = delta * spread;
        const focus = Math.max(0, 1 - Math.min(1, distance / 2.5));

        return (
          <MotionImage
            key={`${asset.path}-${index}`}
            asset={asset}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            x={x}
            y={distance * 10 - 18}
            z={140 + focus * 220 - distance * 30}
            rotateY={angle * (1 - focus)}
            rotateX={focus * 2}
            scale={0.78 + focus * 0.5}
            opacity={0.42 + focus * 0.58}
            frameStyle={theme.frameStyle}
            blurPx={Math.max(0, (1 - focus) * 1.6)}
            highlight={distance === 0}
            shadowStrength={1 + focus * 0.2}
            debugLabel={debug ? `accordion-${index}` : undefined}
          />
        );
      })}

      <FinalComposition
        assets={assets}
        mode={finalComposition}
        progress={finalProgress}
        width={width}
        height={height}
        theme={theme}
        text={text}
        seed={seed}
      />
    </PerspectiveStage>
  );
};
