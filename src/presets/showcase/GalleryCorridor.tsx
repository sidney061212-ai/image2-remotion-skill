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
  const depthSpacing = Math.min(width, height) * 0.38;
  const laneOffset = Math.min(width, height) * 0.38;
  const positions = distributeCorridor(assets.length, laneOffset, depthSpacing, seed + 21);

  const finalStart = Math.floor(durationInFrames * 0.8);
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const travelProgress = phaseProgress(frame, 0, Math.floor(durationInFrames * 0.82));
  const travelEase = Easing.inOut(Easing.quad)(travelProgress);
  const maxCameraTravel = Math.max(depthSpacing * (assets.length - 1), 1);

  const cameraZ = interpolate(travelEase, [0, 1], [-260, maxCameraTravel * intensityFactor], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const swayX = cameraSway(frame, width * 0.018 * intensityFactor, 0.028);
  const swayY = cameraSway(frame, height * 0.008, 0.045);
  const rotateY = cameraSway(frame, 3.2 * intensityFactor, 0.018);
  const rollZ = cameraSway(frame, 1.5, 0.013);

  const cardWidth = Math.min(width, height) * 0.23;
  const cardHeight = cardWidth * 0.68;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(${swayX}px, ${swayY}px, ${cameraZ}px) rotateY(${rotateY}deg) rotateZ(${rollZ}deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.08, 0.42])}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: laneOffset * 1.2,
          height: height * 1.55,
          transformStyle: 'preserve-3d',
          transform: `translate3d(${-laneOffset * 1.58}px, ${-height * 0.78}px, ${-maxCameraTravel * 0.18}px) rotateY(72deg)`,
          background:
            'linear-gradient(180deg, rgba(148,163,184,0.22) 0%, rgba(15,23,42,0.06) 24%, rgba(15,23,42,0.26) 100%)',
          border: '1px solid rgba(148,163,184,0.24)',
          opacity: 0.34
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
          transform: `translate3d(${laneOffset * 0.38}px, ${-height * 0.78}px, ${-maxCameraTravel * 0.18}px) rotateY(-72deg)`,
          background:
            'linear-gradient(180deg, rgba(148,163,184,0.22) 0%, rgba(15,23,42,0.06) 24%, rgba(15,23,42,0.26) 100%)',
          border: '1px solid rgba(148,163,184,0.24)',
          opacity: 0.34
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
          transform: `translate3d(${-width * 0.46}px, ${-height * 0.16}px, ${-maxCameraTravel * 0.24}px) rotateX(74deg)`,
          background:
            'linear-gradient(180deg, rgba(15,23,42,0.34) 0%, rgba(15,23,42,0.06) 42%, rgba(15,23,42,0.42) 100%)',
          opacity: 0.28
        }}
      />

      {assets.map((asset, index) => {
        const position = positions[index];
        const relativeDepth = position.z + cameraZ;
        const focusWindow = depthSpacing * 0.62;
        const focusStrength = Math.max(0, 1 - Math.min(1, Math.abs(relativeDepth) / focusWindow));
        const passingFlash = Math.max(0, 1 - Math.min(1, Math.abs(relativeDepth) / (depthSpacing * 0.38)));

        const scale = 0.7 + focusStrength * 0.44;
        const opacity = 0.26 + focusStrength * 0.82;
        const blurPx = Math.min(7, Math.abs(relativeDepth) / (depthSpacing * 0.16));

        return (
          <MotionImage
            key={`${asset.path}-${index}`}
            asset={asset}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            x={position.x}
            y={position.y + Math.sin((frame + index * 6) * 0.018) * 10}
            z={position.z}
            rotateY={position.rotateY}
            scale={scale}
            opacity={opacity * (1 - finalProgress * 0.4)}
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
            'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.06) 0%, rgba(2,6,23,0.08) 42%, rgba(2,6,23,0.48) 100%)'
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          opacity: 0.22,
          background:
            'linear-gradient(90deg, rgba(2,6,23,0.58) 0%, rgba(2,6,23,0.06) 30%, rgba(2,6,23,0.06) 70%, rgba(2,6,23,0.58) 100%)'
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
