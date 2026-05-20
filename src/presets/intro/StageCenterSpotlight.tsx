import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
import {distributeOnCircle} from '../../motion/layout';
import {phaseProgress} from '../../motion/timeline';
import {getStepState, resolveStepFrames} from '../shared/sequence';
import type {MultiImagePresetProps} from '../types';

export const StageCenterSpotlight: React.FC<MultiImagePresetProps> = ({
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

  // Script: one hero image at center stage; support images stay around as ambient ring.
  const stepFrames = resolveStepFrames(fps, imageHoldSeconds, 3.8);
  const sequence = getStepState(frame, assets.length, stepFrames);
  const finalStart = Math.min(durationInFrames - 1, Math.max(sequence.totalFrames - Math.floor(fps * 0.7), Math.floor(durationInFrames * 0.84)));
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const ring = distributeOnCircle(Math.max(assets.length, 2), Math.min(width, height) * 0.28, seed + 701);
  const centerWidth = Math.min(width, height) * 0.46;
  const centerHeight = centerWidth * 0.66;
  const sideWidth = centerWidth * 0.42;
  const sideHeight = sideWidth * 0.66;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(0px, 0px, ${interpolate(phaseProgress(frame, 0, durationInFrames - 1), [0, 1], [-520, -210])}px) rotateX(-4deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.02, 0.14])}
    >
      {assets.map((asset, index) => {
        if (index === sequence.stepIndex) {
          return null;
        }

        const pos = ring[index % ring.length];
        return (
          <MotionImage
            key={`${asset.path}-${index}`}
            asset={asset}
            cardWidth={sideWidth}
            cardHeight={sideHeight}
            x={pos.x}
            y={pos.y * 0.72}
            z={40 + (pos.z ?? 0) * 0.46}
            rotateY={pos.rotateY}
            scale={0.84}
            opacity={0.48}
            frameStyle={theme.frameStyle}
            blurPx={0.8}
            shadowStrength={0.94}
            debugLabel={debug ? `stage-side-${index}` : undefined}
          />
        );
      })}

      {assets[sequence.stepIndex] ? (
        <MotionImage
          asset={assets[sequence.stepIndex]}
          cardWidth={centerWidth}
          cardHeight={centerHeight}
          x={0}
          y={-height * 0.01}
          z={360}
          rotateY={Math.sin(frame * 0.01) * 3}
          scale={1.04 + Math.sin(frame * 0.04) * 0.01}
          opacity={1}
          frameStyle={theme.frameStyle}
          highlight
          shadowStrength={1.28}
          debugLabel={debug ? `stage-main-${sequence.stepIndex}` : undefined}
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
