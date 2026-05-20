import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
import {phaseProgress} from '../../motion/timeline';
import {getStepState, inHoldOut, resolveStepFrames} from '../shared/sequence';
import type {MultiImagePresetProps} from '../types';

export const SplitPanelCompare: React.FC<MultiImagePresetProps> = ({
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

  // Script: pairs of images are shown in left/right panels for comparison.
  const pairCount = Math.max(1, Math.ceil(assets.length / 2));
  const stepFrames = resolveStepFrames(fps, imageHoldSeconds, 4.5);
  const sequence = getStepState(frame, pairCount, stepFrames);
  const timing = inHoldOut(sequence.localFrame, sequence.stepFrames, 0.22, 0.2);

  const leftIndex = Math.min(assets.length - 1, sequence.stepIndex * 2);
  const rightIndex = Math.min(assets.length - 1, sequence.stepIndex * 2 + 1);

  const finalStart = Math.min(durationInFrames - 1, Math.max(sequence.totalFrames - Math.floor(fps * 0.8), Math.floor(durationInFrames * 0.86)));
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const cardWidth = Math.min(width, height) * 0.38;
  const cardHeight = cardWidth * 0.66;
  const leftX = -width * 0.22;
  const rightX = width * 0.22;

  const enter = Easing.out(Easing.cubic)(timing.enter);
  const exit = Easing.in(Easing.cubic)(timing.exit);

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(0px, 0px, ${interpolate(phaseProgress(frame, 0, durationInFrames - 1), [0, 1], [-360, -210])}px)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.02, 0.12])}
    >
      {assets[leftIndex] ? (
        <MotionImage
          asset={assets[leftIndex]}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          x={interpolate(enter, [0, 1], [leftX - 130, leftX])}
          y={-height * 0.02}
          z={interpolate(exit, [0, 1], [260, 120])}
          rotateY={interpolate(exit, [0, 1], [2, -4])}
          scale={1.02 + Math.sin(timing.hold * Math.PI) * 0.015}
          opacity={interpolate(exit, [0, 1], [1, 0.84])}
          frameStyle={theme.frameStyle}
          highlight
          shadowStrength={1.16}
          debugLabel={debug ? `split-left-${leftIndex}` : undefined}
        />
      ) : null}

      {assets[rightIndex] ? (
        <MotionImage
          asset={assets[rightIndex]}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          x={interpolate(enter, [0, 1], [rightX + 130, rightX])}
          y={height * 0.02}
          z={interpolate(exit, [0, 1], [240, 120])}
          rotateY={interpolate(exit, [0, 1], [-2, 4])}
          scale={1.01 + Math.sin((timing.hold + 0.25) * Math.PI) * 0.015}
          opacity={interpolate(exit, [0, 1], [1, 0.84])}
          frameStyle={theme.frameStyle}
          highlight
          shadowStrength={1.16}
          debugLabel={debug ? `split-right-${rightIndex}` : undefined}
        />
      ) : null}

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
