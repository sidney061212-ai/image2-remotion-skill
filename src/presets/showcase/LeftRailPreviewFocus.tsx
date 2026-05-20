import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
import {phaseProgress} from '../../motion/timeline';
import {getStepState, inHoldOut, resolveStepFrames} from '../shared/sequence';
import type {MultiImagePresetProps} from '../types';

export const LeftRailPreviewFocus: React.FC<MultiImagePresetProps> = ({
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

  // Script: left rail stays fixed, active image expands in the main stage and retracts.
  const stepFrames = resolveStepFrames(fps, imageHoldSeconds, 5);
  const sequence = getStepState(frame, assets.length, stepFrames);
  const timing = inHoldOut(sequence.localFrame, sequence.stepFrames, 0.18, 0.2);

  const finalStart = Math.min(durationInFrames - 1, Math.max(sequence.totalFrames - Math.floor(fps * 0.8), Math.floor(durationInFrames * 0.86)));
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const railX = -width * 0.39;
  const railStartY = -height * 0.3;
  const railGap = Math.min(120, height * 0.13);
  const thumbWidth = Math.min(width, height) * 0.12;
  const thumbHeight = thumbWidth * 0.66;

  const focusWidth = Math.min(width, height) * 0.52;
  const focusHeight = focusWidth * 0.66;

  const enter = Easing.out(Easing.cubic)(timing.enter);
  const exit = Easing.in(Easing.cubic)(timing.exit);
  const holdPulse = Math.sin(timing.hold * Math.PI) * 0.02;

  const focusXIn = interpolate(enter, [0, 1], [railX + 60, width * 0.08]);
  const focusYIn = interpolate(enter, [0, 1], [railStartY + sequence.stepIndex * railGap * 0.2, -height * 0.02]);
  const focusX = interpolate(exit, [0, 1], [focusXIn, railX + 26]);
  const focusY = interpolate(exit, [0, 1], [focusYIn, railStartY + sequence.stepIndex * railGap]);

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(0px, 0px, ${interpolate(phaseProgress(frame, 0, durationInFrames - 1), [0, 1], [-320, -200])}px)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.01, 0.12])}
    >
      {assets.slice(0, 9).map((asset, index) => {
        const isActive = index === sequence.stepIndex;

        return (
          <MotionImage
            key={`${asset.path}-${index}`}
            asset={asset}
            cardWidth={thumbWidth}
            cardHeight={thumbHeight}
            x={railX}
            y={railStartY + index * railGap}
            z={isActive ? 120 : 0}
            scale={isActive ? 1.06 : 0.92}
            opacity={isActive ? 1 : 0.66}
            frameStyle={theme.frameStyle}
            blurPx={isActive ? 0 : 0.5}
            highlight={isActive}
            debugLabel={debug ? `rail-${index}` : undefined}
          />
        );
      })}

      {assets[sequence.stepIndex] ? (
        <MotionImage
          asset={assets[sequence.stepIndex]}
          cardWidth={focusWidth}
          cardHeight={focusHeight}
          x={focusX}
          y={focusY}
          z={340}
          rotateY={interpolate(exit, [0, 1], [0, -10])}
          rotateX={interpolate(enter, [0, 1], [6, 0])}
          scale={1.02 + holdPulse}
          opacity={interpolate(exit, [0, 1], [1, 0.86])}
          frameStyle={theme.frameStyle}
          blurPx={0}
          highlight
          shadowStrength={1.22}
          debugLabel={debug ? `focus-${sequence.stepIndex}` : undefined}
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
