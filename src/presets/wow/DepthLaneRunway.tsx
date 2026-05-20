import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
import {phaseProgress} from '../../motion/timeline';
import type {MultiImagePresetProps} from '../types';

export const DepthLaneRunway: React.FC<MultiImagePresetProps> = ({
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

  // Script: three depth lanes rush toward camera, emphasizing runway perspective.
  const travelProgress = phaseProgress(frame, 0, Math.floor(durationInFrames * 0.86));
  const finalStart = Math.floor(durationInFrames * 0.87);
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const lane = Math.min(width, height) * 0.26;
  const lanes = [-lane, 0, lane];
  const spacing = Math.min(width, height) * 0.34;
  const cameraZ = interpolate(travelProgress, [0, 1], [-680, spacing * assets.length * 1.15]);
  const roll = interpolate(travelProgress, [0, 1], [0, intensity === 'high' ? 8 : 5]);

  const cardWidth = Math.min(width, height) * 0.24;
  const cardHeight = cardWidth * 0.66;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(0px, 0px, ${cameraZ}px) rotateZ(${roll}deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.04, 0.16])}
    >
      {assets.map((asset, index) => {
        const laneX = lanes[index % lanes.length] + Math.sin((frame + index * 13) * 0.01) * 26;
        const z = -index * spacing;
        const relative = z + cameraZ;
        const focus = Math.max(0, 1 - Math.min(1, Math.abs(relative) / (spacing * 0.5)));

        return (
          <MotionImage
            key={`${asset.path}-${index}`}
            asset={asset}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            x={laneX}
            y={Math.sin((frame + index * 7) * 0.03) * 20}
            z={z}
            rotateY={laneX < 0 ? 8 : laneX > 0 ? -8 : 0}
            scale={0.54 + focus * 1.12}
            opacity={0.28 + focus * 0.72}
            frameStyle={theme.frameStyle}
            blurPx={Math.max(0, (1 - focus) * 3.8)}
            highlight={focus > 0.8}
            shadowStrength={1 + focus * 0.26}
            debugLabel={debug ? `runway-${index}` : undefined}
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
