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
  const radius = Math.min(width, height) * (intensity === 'high' ? 0.36 : 0.32);
  const depthSpacing = Math.min(width, height) * (intensity === 'high' ? 0.46 : 0.38);
  const positions = distributeHelix(assets.length, radius, depthSpacing, seed + 57);

  const finalStart = Math.floor(durationInFrames * 0.79);
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const travelProgress = phaseProgress(frame, 0, Math.floor(durationInFrames * 0.86));
  const travelCurve = interpolate(travelProgress, [0, 0.45, 0.78, 1], [0, 0.34, 0.9, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const speedBurst = Math.sin(phaseProgress(frame, Math.floor(durationInFrames * 0.3), Math.floor(durationInFrames * 0.74)) * Math.PI);

  const cameraZ = interpolate(travelCurve, [0, 1], [-420, depthSpacing * assets.length * 1.04], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const cameraRoll = cameraSway(frame, intensity === 'high' ? 8.5 : 6, 0.02) +
    interpolate(travelProgress, [0, 1], [0, 10 * intensityFactor], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });

  const helixSpin = interpolate(travelProgress, [0, 0.45, 0.82, 1], [0, 120, 380 * intensityFactor, 460 * intensityFactor], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const cardWidth = Math.min(width, height) * 0.205;
  const cardHeight = cardWidth * 0.66;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(0px, 0px, ${cameraZ}px) rotateZ(${cameraRoll}deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.1, 0.48])}
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
            0.42,
            1.42
          );
          const opacity = depthOpacity(
            relativeZ,
            depthSpacing * 0.85,
            -depthSpacing * assets.length * 1.12,
            0.14,
            1
          );

          const focusStrength = Math.max(0, 1 - Math.min(1, Math.abs(relativeZ) / (depthSpacing * 0.5)));
          const blurByDepth = interpolate(
            Math.abs(relativeZ),
            [0, depthSpacing * 0.4, depthSpacing * 2.6],
            [0, 1.4, 6.4],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp'
            }
          );
          const blurPx = Math.min(8, blurByDepth + speedBurst * (1 - focusStrength) * 2.4);

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
              opacity={opacity * (1 - finalProgress * 0.38)}
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
            'radial-gradient(circle at 50% 48%, rgba(255,255,255,0.08) 0%, rgba(30,41,59,0.1) 30%, rgba(2,6,23,0.56) 100%)'
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          opacity: 0.2 + speedBurst * 0.1,
          background: 'linear-gradient(90deg, rgba(2,6,23,0.62) 0%, rgba(2,6,23,0.04) 22%, rgba(2,6,23,0.04) 78%, rgba(2,6,23,0.62) 100%)'
        }}
      />

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
        <div style={{fontSize: Math.round(width * 0.032), fontWeight: 760}}>{text?.title ?? 'Helix Tunnel'}</div>
        <div style={{fontSize: Math.round(width * 0.015), marginTop: 8, opacity: 0.82}}>
          High-speed helix tunnel traversal with depth-driven blur and convergence.
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
