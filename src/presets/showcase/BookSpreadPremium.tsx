import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
import {phaseProgress} from '../../motion/timeline';
import {getStepState, inHoldOut, resolveStepFrames} from '../shared/sequence';
import type {MultiImagePresetProps} from '../types';

export const BookSpreadPremium: React.FC<MultiImagePresetProps> = ({
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

  // Script: premium photo-book spread, current page + next page preview with flip transition.
  const stepFrames = resolveStepFrames(fps, imageHoldSeconds, 5);
  const sequence = getStepState(frame, assets.length, stepFrames);
  const timing = inHoldOut(sequence.localFrame, sequence.stepFrames, 0.22, 0.2);

  const currentIndex = sequence.stepIndex;
  const nextIndex = (sequence.stepIndex + 1) % Math.max(1, assets.length);

  const finalStart = Math.min(durationInFrames - 1, Math.max(sequence.totalFrames - Math.floor(fps * 0.9), Math.floor(durationInFrames * 0.86)));
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const currentWidth = Math.min(width, height) * 0.5;
  const currentHeight = currentWidth * 0.66;
  const nextWidth = currentWidth * 0.54;
  const nextHeight = nextWidth * 0.66;

  const pageTurn = Easing.inOut(Easing.cubic)(timing.exit);

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(0px, 0px, ${interpolate(phaseProgress(frame, 0, durationInFrames - 1), [0, 1], [-420, -220])}px) rotateY(-2deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.02, 0.14])}
    >
      {assets[currentIndex] ? (
        <MotionImage
          asset={assets[currentIndex]}
          cardWidth={currentWidth}
          cardHeight={currentHeight}
          x={-width * 0.12}
          y={-height * 0.03}
          z={260}
          rotateY={interpolate(pageTurn, [0, 1], [0, -26])}
          scale={1.03}
          opacity={interpolate(pageTurn, [0, 1], [1, 0.8])}
          frameStyle={theme.frameStyle}
          highlight
          shadowStrength={1.24}
          debugLabel={debug ? `book-current-${currentIndex}` : undefined}
        />
      ) : null}

      {assets[nextIndex] ? (
        <MotionImage
          asset={assets[nextIndex]}
          cardWidth={nextWidth}
          cardHeight={nextHeight}
          x={width * 0.21}
          y={height * 0.02}
          z={180}
          rotateY={interpolate(pageTurn, [0, 1], [-16, -4])}
          scale={interpolate(pageTurn, [0, 1], [0.88, 1])}
          opacity={0.86}
          frameStyle={theme.frameStyle}
          shadowStrength={1.1}
          debugLabel={debug ? `book-next-${nextIndex}` : undefined}
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
