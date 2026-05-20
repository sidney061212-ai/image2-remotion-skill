import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
import {phaseProgress} from '../../motion/timeline';
import type {MultiImagePresetProps} from '../types';

export const MuseumWallWalk: React.FC<MultiImagePresetProps> = ({
  assets,
  width,
  height,
  intensity,
  theme,
  finalComposition,
  text,
  seed,
  debug
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  // Script: camera walks along a long museum wall and focuses passing images.
  const travelProgress = phaseProgress(frame, 0, Math.floor(durationInFrames * 0.84));
  const finalStart = Math.floor(durationInFrames * 0.86);
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const spacing = Math.min(width, height) * 0.42;
  const cardWidth = Math.min(width, height) * 0.29;
  const cardHeight = cardWidth * 0.66;
  const travel = spacing * Math.max(0, assets.length - 1);
  const drift = interpolate(travelProgress, [0, 1], [0, -travel]);
  const cameraZ = interpolate(travelProgress, [0, 1], [-420, -250]);
  const intensityTilt = intensity === 'high' ? 2.6 : intensity === 'low' ? 1.3 : 2;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(${drift}px, 0px, ${cameraZ}px) rotateY(${intensityTilt}deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.02, 0.14])}
    >
      {assets.map((asset, index) => {
        const baseX = index * spacing - travel / 2;
        const relativeX = baseX + drift;
        const focus = Math.max(0, 1 - Math.min(1, Math.abs(relativeX) / (spacing * 0.62)));

        return (
          <MotionImage
            key={`${asset.path}-${index}`}
            asset={asset}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            x={baseX}
            y={Math.sin((frame + index * 5) * 0.01) * 14}
            z={80 + focus * 180}
            rotateY={focus * -3}
            scale={0.84 + focus * 0.38}
            opacity={0.55 + focus * 0.45}
            frameStyle={theme.frameStyle}
            blurPx={Math.max(0, (1 - focus) * 2.4)}
            highlight={focus > 0.72}
            shadowStrength={1 + focus * 0.18}
            debugLabel={debug ? `wall-${index}` : undefined}
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
