import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
import {phaseProgress} from '../../motion/timeline';
import {getStepState, inHoldOut, resolveStepFrames} from '../shared/sequence';
import type {MultiImagePresetProps} from '../types';

export const CornerDeckPull: React.FC<MultiImagePresetProps> = ({
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

  // Script: images stack in top-right; one image is pulled down every step.
  const stepFrames = resolveStepFrames(fps, imageHoldSeconds, 5);
  const sequence = getStepState(frame, assets.length, stepFrames);
  const timing = inHoldOut(sequence.localFrame, sequence.stepFrames, 0.2, 0.2);

  const finalStart = Math.min(durationInFrames - 1, Math.max(sequence.totalFrames - Math.floor(fps * 0.9), Math.floor(durationInFrames * 0.86)));
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const stackX = width * 0.34;
  const stackY = -height * 0.34;
  const cardWidth = Math.min(width, height) * 0.31;
  const cardHeight = cardWidth * 0.66;

  const cameraPush = interpolate(phaseProgress(frame, 0, durationInFrames - 1), [0, 1], [-420, -220]);

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(0px, 0px, ${cameraPush}px) rotateY(-4deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.02, 0.14])}
    >
      {assets.map((asset, index) => {
        const order = (index - sequence.stepIndex + assets.length) % assets.length;
        const isActive = index === sequence.stepIndex;
        const travel = Easing.inOut(Easing.cubic)(timing.enter);
        const settle = Easing.inOut(Easing.quad)(timing.hold);
        const retreat = Easing.in(Easing.cubic)(timing.exit);

        const activeX = interpolate(travel, [0, 1], [stackX - 46, width * 0.06]);
        const activeY = interpolate(travel, [0, 1], [stackY + 38, -height * 0.02]);
        const activeZ = interpolate(travel, [0, 1], [40, 320]);

        const returnX = interpolate(retreat, [0, 1], [activeX, stackX + 6]);
        const returnY = interpolate(retreat, [0, 1], [activeY, stackY + 6]);
        const returnZ = interpolate(retreat, [0, 1], [activeZ, 20]);

        const x = isActive ? returnX : stackX + Math.min(order, 7) * 4;
        const y = isActive ? returnY : stackY + Math.min(order, 7) * 5;
        const z = isActive ? returnZ : 10 - Math.min(order, 7) * 8;
        const scale = isActive
          ? interpolate(settle, [0, 1], [1.02, 1.06])
          : 0.8 - Math.min(0.22, order * 0.03);

        return (
          <MotionImage
            key={`${asset.path}-${index}`}
            asset={asset}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            x={x}
            y={y}
            z={z}
            rotateY={isActive ? interpolate(retreat, [0, 1], [-8, -2]) : -22 + order * 2.5}
            rotateX={isActive ? interpolate(timing.enter, [0, 1], [6, 0]) : 2}
            rotateZ={isActive ? interpolate(retreat, [0, 1], [2, -2]) : -4 + order * 0.6}
            scale={scale}
            opacity={isActive ? 1 : Math.max(0.4, 0.84 - order * 0.08)}
            frameStyle={theme.frameStyle}
            blurPx={isActive ? 0 : Math.min(2.5, order * 0.5)}
            highlight={isActive}
            shadowStrength={isActive ? 1.24 : 0.95}
            debugLabel={debug ? `corner-${index}` : undefined}
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
