import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
import {distributeGrid} from '../../motion/layout';
import {phaseProgress} from '../../motion/timeline';
import {getStepState, resolveStepFrames} from '../shared/sequence';
import type {MultiImagePresetProps} from '../types';

export const FloatingGridBreathe: React.FC<MultiImagePresetProps> = ({
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

  // Script: multi-layer floating grid with breathing depth and one promoted active card.
  const stepFrames = resolveStepFrames(fps, imageHoldSeconds, 4.8);
  const sequence = getStepState(frame, assets.length, stepFrames);
  const finalStart = Math.min(durationInFrames - 1, Math.max(sequence.totalFrames - Math.floor(fps * 0.8), Math.floor(durationInFrames * 0.86)));
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const layout = distributeGrid(Math.min(assets.length, 16), width * 0.92, height * 0.8, 4);
  const cardWidth = Math.min(width, height) * 0.21;
  const cardHeight = cardWidth * 0.66;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(0px, 0px, ${interpolate(phaseProgress(frame, 0, durationInFrames - 1), [0, 1], [-480, -240])}px) rotateX(-3deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.02, 0.12])}
    >
      {assets.slice(0, 16).map((asset, index) => {
        const pos = layout[index];
        const layer = index % 3;
        const wave = Math.sin((frame + index * 9 + seed * 7) * 0.03);
        const isActive = index === sequence.stepIndex % Math.min(assets.length, 16);
        const activeLift = isActive ? 220 : 0;

        return (
          <MotionImage
            key={`${asset.path}-${index}`}
            asset={asset}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            x={pos.x + wave * 16}
            y={pos.y + wave * 10}
            z={layer * 120 + wave * 42 + activeLift}
            rotateY={wave * 8}
            rotateX={layer * 1.8}
            scale={(isActive ? 1.08 : 0.9) + wave * 0.02}
            opacity={isActive ? 1 : 0.66}
            frameStyle={theme.frameStyle}
            blurPx={isActive ? 0 : layer * 0.6}
            highlight={isActive}
            shadowStrength={isActive ? 1.2 : 1}
            debugLabel={debug ? `grid-${index}` : undefined}
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
