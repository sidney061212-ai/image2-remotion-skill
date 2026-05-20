import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
import {cameraSway} from '../../motion/camera';
import {distributeCorridor} from '../../motion/layout';
import {phaseProgress} from '../../motion/timeline';
import type {MultiImagePresetProps} from '../types';

export const GalleryCorridor: React.FC<MultiImagePresetProps> = ({
  assets,
  width,
  height,
  intensity,
  finalComposition,
  theme,
  text,
  seed,
  debug
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const depthSpacing = Math.min(width, height) * 0.34;
  const laneOffset = Math.min(width, height) * 0.33;
  const positions = distributeCorridor(assets.length, laneOffset, depthSpacing, seed + 21);
  const finalStart = Math.floor(durationInFrames * 0.8);
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const intensityFactor = intensity === 'high' ? 1.2 : intensity === 'low' ? 0.85 : 1;
  const maxCameraTravel = Math.max(depthSpacing * (assets.length - 1), 1);
  const cameraZ = interpolate(frame, [0, durationInFrames * 0.82], [0, maxCameraTravel * intensityFactor], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const swayX = cameraSway(frame, width * 0.02 * intensityFactor, 0.03);
  const swayY = cameraSway(frame, height * 0.008, 0.05);
  const rotateY = cameraSway(frame, 2.4 * intensityFactor, 0.02);

  const cardWidth = Math.min(width, height) * 0.22;
  const cardHeight = cardWidth * 0.68;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(${swayX}px, ${swayY}px, ${cameraZ}px) rotateY(${rotateY}deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0, 0.4])}
    >
      {assets.map((asset, index) => {
        const position = positions[index];
        const relativeDepth = position.z + cameraZ;
        const focusStrength = Math.max(0, 1 - Math.min(1, Math.abs(relativeDepth) / (depthSpacing * 0.85)));
        const scale = 0.8 + focusStrength * 0.35;
        const opacity = 0.35 + focusStrength * 0.7;

        return (
          <MotionImage
            key={`${asset.path}-${index}`}
            asset={asset}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            x={position.x}
            y={position.y}
            z={position.z}
            rotateY={position.rotateY}
            scale={scale}
            opacity={opacity * (1 - finalProgress * 0.45)}
            frameStyle={theme.frameStyle}
            highlight={focusStrength > 0.82}
            debugLabel={debug ? `corridor-${index}` : undefined}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 60,
          bottom: 52,
          color: '#f8fafc',
          opacity: 1 - finalProgress
        }}
      >
        <div style={{fontSize: Math.round(width * 0.03), fontWeight: 700}}>{text?.title ?? 'Gallery Corridor'}</div>
        <div style={{fontSize: Math.round(width * 0.016), marginTop: 8, opacity: 0.8}}>
          Spatial showcase with corridor depth and camera traversal.
        </div>
      </div>

      <FinalComposition
        assets={assets}
        mode={finalComposition}
        progress={finalProgress}
        width={width}
        height={height}
        text={text}
        theme={theme}
        seed={seed}
      />
    </PerspectiveStage>
  );
};
