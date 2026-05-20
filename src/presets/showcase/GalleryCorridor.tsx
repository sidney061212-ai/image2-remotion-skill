import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
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

  const intensityFactor = intensity === 'high' ? 1.22 : intensity === 'low' ? 0.88 : 1;
  const depthSpacing = Math.min(width, height) * 0.33;
  const laneOffset = Math.min(width, height) * 0.26;
  const positions = distributeCorridor(assets.length, laneOffset, depthSpacing, seed + 21);

  const finalStart = Math.floor(durationInFrames * 0.86);
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const travelProgress = phaseProgress(frame, 0, Math.floor(durationInFrames * 0.88));
  const travelEase = Easing.inOut(Easing.cubic)(travelProgress);
  const maxCameraTravel = Math.max(depthSpacing * (assets.length - 1), 1);

  const cameraZ = interpolate(travelEase, [0, 0.6, 1], [-460, maxCameraTravel * 0.48, maxCameraTravel * 1.08 * intensityFactor], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const swayX = cameraSway(frame, width * 0.014 * intensityFactor, 0.024);
  const swayY = cameraSway(frame, height * 0.006, 0.042);
  const rotateY = cameraSway(frame, 2.6 * intensityFactor, 0.017);
  const rollZ = cameraSway(frame, 1.05, 0.012);

  const cardWidth = Math.min(width, height) * 0.37;
  const cardHeight = cardWidth * 0.68;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(${swayX}px, ${swayY}px, ${cameraZ}px) rotateY(${rotateY}deg) rotateZ(${rollZ}deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.03, 0.15])}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: laneOffset * 1.2,
          height: height * 1.55,
          transformStyle: 'preserve-3d',
          transform: `translate3d(${-laneOffset * 1.52}px, ${-height * 0.8}px, ${-maxCameraTravel * 0.2}px) rotateY(72deg)`,
          background:
            'linear-gradient(180deg, rgba(148,163,184,0.16) 0%, rgba(15,23,42,0.03) 24%, rgba(15,23,42,0.2) 100%)',
          border: '1px solid rgba(148,163,184,0.14)',
          opacity: 0.22
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: laneOffset * 1.2,
          height: height * 1.55,
          transformStyle: 'preserve-3d',
          transform: `translate3d(${laneOffset * 0.32}px, ${-height * 0.8}px, ${-maxCameraTravel * 0.2}px) rotateY(-72deg)`,
          background:
            'linear-gradient(180deg, rgba(148,163,184,0.16) 0%, rgba(15,23,42,0.03) 24%, rgba(15,23,42,0.2) 100%)',
          border: '1px solid rgba(148,163,184,0.14)',
          opacity: 0.22
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: width * 0.92,
          height: height * 1.12,
          transformStyle: 'preserve-3d',
          transform: `translate3d(${-width * 0.46}px, ${-height * 0.2}px, ${-maxCameraTravel * 0.24}px) rotateX(74deg)`,
          background:
            'linear-gradient(180deg, rgba(15,23,42,0.22) 0%, rgba(15,23,42,0.03) 42%, rgba(15,23,42,0.26) 100%)',
          opacity: 0.2
        }}
      />

      {assets.map((asset, index) => {
        const position = positions[index];
        const relativeDepth = position.z + cameraZ;
        const focusWindow = depthSpacing * 0.62;
        const focusStrength = Math.max(0, 1 - Math.min(1, Math.abs(relativeDepth) / focusWindow));
        const passingFlash = Math.max(0, 1 - Math.min(1, Math.abs(relativeDepth) / (depthSpacing * 0.38)));

        const centerPull = interpolate(
          Math.abs(relativeDepth),
          [0, depthSpacing * 0.5, depthSpacing * 2.2],
          [0.22, 0.48, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          }
        );
        const dynamicX = position.x * centerPull;
        const scale = 0.9 + focusStrength * 0.48;
        const opacity = 0.62 + focusStrength * 0.42;
        const blurPx = Math.min(5.4, Math.abs(relativeDepth) / (depthSpacing * 0.21));

        return (
          <MotionImage
            key={`${asset.path}-${index}`}
            asset={asset}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            x={dynamicX}
            y={position.y + Math.sin((frame + index * 6) * 0.018) * 10}
            z={position.z}
            rotateY={position.rotateY}
            scale={scale}
            opacity={opacity * (1 - finalProgress * 0.18)}
            frameStyle={theme.frameStyle}
            blurPx={blurPx * (1 - focusStrength * 0.9)}
            highlight={focusStrength > 0.78}
            shadowStrength={1 + passingFlash * 0.35}
            debugLabel={debug ? `corridor-${index}` : undefined}
          />
        );
      })}

      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.04) 0%, rgba(2,6,23,0.03) 42%, rgba(2,6,23,0.2) 100%)'
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          opacity: 0.12,
          background:
            'linear-gradient(90deg, rgba(2,6,23,0.4) 0%, rgba(2,6,23,0.03) 24%, rgba(2,6,23,0.03) 76%, rgba(2,6,23,0.4) 100%)'
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
