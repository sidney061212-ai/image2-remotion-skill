import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
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

  const intensityFactor = intensity === 'high' ? 1.26 : intensity === 'low' ? 0.85 : 1;
  const radius = Math.min(width, height) * (intensity === 'high' ? 0.38 : 0.34);
  const depthSpacing = Math.min(width, height) * (intensity === 'high' ? 0.42 : 0.35);
  const positions = distributeHelix(assets.length, radius, depthSpacing, seed + 57);

  const finalStart = Math.floor(durationInFrames * 0.86);
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const travelProgress = phaseProgress(frame, 0, Math.floor(durationInFrames * 0.86));
  const travelCurve = interpolate(travelProgress, [0, 0.34, 0.76, 1], [0, 0.22, 0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const speedBurst = Math.sin(phaseProgress(frame, Math.floor(durationInFrames * 0.3), Math.floor(durationInFrames * 0.74)) * Math.PI);

  const cameraZ = interpolate(travelCurve, [0, 1], [-680, depthSpacing * assets.length * 1.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const cameraRoll = cameraSway(frame, intensity === 'high' ? 8.5 : 6, 0.02) +
    interpolate(travelProgress, [0, 1], [0, 10 * intensityFactor], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });

  const helixSpin = interpolate(travelProgress, [0, 0.42, 0.82, 1], [0, 100, 420 * intensityFactor, 520 * intensityFactor], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const cardWidth = Math.min(width, height) * 0.25;
  const cardHeight = cardWidth * 0.66;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(0px, 0px, ${cameraZ}px) rotateZ(${cameraRoll}deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.04, 0.18])}
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
          const relativeZ = position.z + cameraZ;

          const scale = depthScale(
            relativeZ,
            depthSpacing * 0.85,
            -depthSpacing * assets.length * 1.12,
            0.5,
            1.62
          );
          const opacity = depthOpacity(
            relativeZ,
            depthSpacing * 0.85,
            -depthSpacing * assets.length * 1.12,
            0.24,
            1
          );

          const focusStrength = Math.max(0, 1 - Math.min(1, Math.abs(relativeZ) / (depthSpacing * 0.5)));
          const blurByDepth = interpolate(
            Math.abs(relativeZ),
            [0, depthSpacing * 0.4, depthSpacing * 2.6],
            [0, 1.2, 5.2],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp'
            }
          );
          const blurPx = Math.min(7, blurByDepth + speedBurst * (1 - focusStrength) * 1.9);

          const helicalWaveX = Math.cos((frame + index * 4) * 0.016) * 18;
          const helicalWaveY = Math.sin((frame + index * 6) * 0.03) * 13;

          return (
            <MotionImage
              key={`${asset.path}-${index}`}
              asset={asset}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              x={position.x + helicalWaveX}
              y={position.y + helicalWaveY}
              z={position.z}
              rotateX={(position.rotateX ?? 0) + Math.sin((frame + index * 8) * 0.01) * 5}
              rotateY={(position.rotateY ?? 0) + helixSpin * 0.24}
              scale={scale}
              opacity={opacity * (1 - finalProgress * 0.18)}
              blurPx={blurPx}
              frameStyle={theme.frameStyle}
              shadowStrength={1.05 + speedBurst * 0.26}
              highlight={focusStrength > 0.82}
              debugLabel={debug ? `helix-${index}` : undefined}
            />
          );
        })}
      </div>

      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 50% 48%, rgba(255,255,255,0.06) 0%, rgba(30,41,59,0.06) 30%, rgba(2,6,23,0.18) 100%)'
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          opacity: 0.11 + speedBurst * 0.06,
          background: 'linear-gradient(90deg, rgba(2,6,23,0.48) 0%, rgba(2,6,23,0.03) 22%, rgba(2,6,23,0.03) 78%, rgba(2,6,23,0.48) 100%)'
        }}
      />

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
