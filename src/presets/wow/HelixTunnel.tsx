import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
import {cameraSway} from '../../motion/camera';
import {depthOpacity, depthScale} from '../../motion/depth';
import {distributeHelix} from '../../motion/layout';
import {phaseProgress} from '../../motion/timeline';
import type {MultiImagePresetProps} from '../types';

export const HelixTunnel: React.FC<MultiImagePresetProps> = ({
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

  const radius = Math.min(width, height) * (intensity === 'high' ? 0.34 : 0.3);
  const depthSpacing = Math.min(width, height) * (intensity === 'high' ? 0.43 : 0.35);
  const positions = distributeHelix(assets.length, radius, depthSpacing, seed + 57);
  const finalStart = Math.floor(durationInFrames * 0.82);
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const cameraZ = interpolate(frame, [0, durationInFrames * 0.84], [-120, depthSpacing * assets.length * 0.92], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const cameraRoll = cameraSway(frame, intensity === 'high' ? 8 : 5, 0.02);
  const helixSpin = interpolate(frame, [0, durationInFrames], [0, intensity === 'high' ? 280 : 190], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const cardWidth = Math.min(width, height) * 0.2;
  const cardHeight = cardWidth * 0.66;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(0px, 0px, ${cameraZ}px) rotateZ(${cameraRoll}deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0, 0.45])}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `rotateZ(${helixSpin}deg)`
        }}
      >
        {assets.map((asset, index) => {
          const position = positions[index];
          const dynamicZ = position.z;
          const relativeZ = dynamicZ + cameraZ;
          const scale = depthScale(relativeZ, depthSpacing * 0.6, -depthSpacing * assets.length, 0.55, 1.22);
          const opacity = depthOpacity(relativeZ, depthSpacing * 0.6, -depthSpacing * assets.length, 0.2, 1);
          const sweepY = position.y + Math.sin((frame + index * 6) * 0.03) * 12;

          return (
            <MotionImage
              key={`${asset.path}-${index}`}
              asset={asset}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              x={position.x}
              y={sweepY}
              z={dynamicZ}
              rotateX={position.rotateX}
              rotateY={(position.rotateY ?? 0) + helixSpin * 0.22}
              scale={scale}
              opacity={opacity * (1 - finalProgress * 0.4)}
              frameStyle={theme.frameStyle}
              debugLabel={debug ? `helix-${index}` : undefined}
            />
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          right: 48,
          top: 42,
          color: '#f8fafc',
          textAlign: 'right',
          opacity: 1 - finalProgress
        }}
      >
        <div style={{fontSize: Math.round(width * 0.032), fontWeight: 700}}>{text?.title ?? 'Helix Tunnel'}</div>
        <div style={{fontSize: Math.round(width * 0.015), marginTop: 8, opacity: 0.78}}>
          High-depth tunnel fly-through with helix spatial choreography.
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
