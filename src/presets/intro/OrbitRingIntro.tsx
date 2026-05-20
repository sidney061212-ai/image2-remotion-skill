import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
import {SafeText} from '../../components/SafeText';
import {distributeOnCircle} from '../../motion/layout';
import {phaseProgress} from '../../motion/timeline';
import type {MultiImagePresetProps} from '../types';

export const OrbitRingIntro: React.FC<MultiImagePresetProps> = ({
  assets,
  width,
  height,
  intensity,
  finalComposition,
  imageHoldSeconds,
  text,
  theme,
  seed,
  debug
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();

  const intensityBoost = intensity === 'high' ? 1.2 : intensity === 'low' ? 0.86 : 1;
  const ringRadius = Math.min(width, height) * 0.35;
  const ringPositions = distributeOnCircle(assets.length, ringRadius, seed + 11, -18);

  const enterEnd = Math.floor(durationInFrames * 0.24);
  const attachEnd = Math.floor(durationInFrames * 0.56);
  const rotateEnd = Math.floor(durationInFrames * 0.88);
  const finalStart = Math.floor(durationInFrames * 0.82);

  const cameraPush = phaseProgress(frame, 0, attachEnd);
  const cameraPushEase = Easing.out(Easing.cubic)(cameraPush);
  const cameraZ = interpolate(cameraPushEase, [0, 1], [-1180, -280], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const cameraRotateY = interpolate(cameraPushEase, [0, 1], [-11, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const cameraRotateX = interpolate(cameraPushEase, [0, 1], [-6, -1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const ringTurn = phaseProgress(frame, enterEnd, rotateEnd);
  const ringTurnEase = Easing.inOut(Easing.cubic)(ringTurn);
  const ringRotateY = interpolate(ringTurnEase, [0, 1], [0, 52 * intensityBoost], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const ringRotateX = interpolate(ringTurnEase, [0, 1], [-14, -4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const ringRotateZ = Math.sin(frame * 0.015) * 1.8;

  const titleReveal = spring({
    frame: Math.max(0, frame - Math.floor(durationInFrames * 0.68)),
    fps,
    config: {damping: 18, mass: 0.84, stiffness: 120}
  });
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const cardWidth = Math.min(width, height) * 0.25;
  const cardHeight = cardWidth * 0.66;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translateZ(${cameraZ}px) rotateX(${cameraRotateX}deg) rotateY(${cameraRotateY}deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.04, 0.36])}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${ringRotateX}deg) rotateY(${ringRotateY}deg) rotateZ(${ringRotateZ}deg)`
        }}
      >
        {assets.map((asset, index) => {
          const base = ringPositions[index];
          const perCardDelay = index * Math.max(2, Math.floor(fps * 0.028));
          const enterProgress = phaseProgress(frame - perCardDelay, 0, enterEnd);
          const attachProgress = phaseProgress(frame - perCardDelay, Math.floor(enterEnd * 0.36), attachEnd);
          const enterEase = Easing.out(Easing.cubic)(enterProgress);

          const swirlAngle = (index / Math.max(assets.length, 1)) * Math.PI * 2;
          const preOrbitOffsetX = Math.cos(swirlAngle + frame * 0.02) * 90;
          const preOrbitOffsetY = Math.sin(swirlAngle + frame * 0.017) * 40;

          const entryX = interpolate(enterEase, [0, 1], [base.x * 1.9 + preOrbitOffsetX, base.x], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });
          const entryY = interpolate(enterEase, [0, 1], [base.y - 180 + preOrbitOffsetY, base.y], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });
          const entryZ = interpolate(enterEase, [0, 1], [base.z - 1700 * intensityBoost, base.z], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });

          const depthPulse = Math.sin((frame + index * 8) * 0.03) * 20 * attachProgress;
          const finalZ = entryZ + depthPulse;
          const scale = interpolate(attachProgress, [0, 1], [0.74, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });
          const depthScale = scale * (1 + (base.z / ringRadius) * 0.13);

          return (
            <MotionImage
              key={`${asset.path}-${index}`}
              asset={asset}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              x={entryX}
              y={entryY}
              z={finalZ}
              rotateY={(base.rotateY ?? 0) + interpolate(enterEase, [0, 1], [70, 0])}
              rotateX={interpolate(attachProgress, [0, 1], [8, 0])}
              scale={depthScale}
              frameStyle={theme.frameStyle}
              blurPx={Math.max(0, 4 * (1 - attachProgress))}
              opacity={interpolate(enterEase, [0, 1], [0, 1])}
              shadowStrength={1.05 + (1 - attachProgress) * 0.2}
              debugLabel={debug ? `orbit-${index}` : undefined}
            />
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(titleReveal, [0, 1], [0.88, 1])})`,
          width: Math.min(width * 0.7, 960),
          opacity: interpolate(titleReveal, [0, 1], [0, 1])
        }}
      >
        <div
          style={{
            margin: '0 auto',
            width: 'fit-content',
            maxWidth: '100%',
            textAlign: 'center',
            color: '#f8fafc',
            padding: `${Math.round(height * 0.02)}px ${Math.round(width * 0.024)}px`,
            borderRadius: 22,
            border: '1px solid rgba(255,255,255,0.28)',
            background: 'linear-gradient(145deg, rgba(10,20,38,0.5), rgba(10,20,38,0.18))',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 20px 44px rgba(0, 0, 0, 0.36)'
          }}
        >
          <SafeText
            value={text?.title ?? 'Creative Memories'}
            style={{fontSize: Math.round(width * 0.06), fontWeight: 760, letterSpacing: 1.3, lineHeight: 1.06}}
          />
          <SafeText
            value={text?.subtitle}
            style={{fontSize: Math.round(width * 0.023), marginTop: 14, opacity: 0.9, fontWeight: 500}}
          />
          <SafeText
            value={text?.caption}
            style={{fontSize: Math.round(width * 0.015), marginTop: 10, opacity: 0.76}}
          />
        </div>
      </div>

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
