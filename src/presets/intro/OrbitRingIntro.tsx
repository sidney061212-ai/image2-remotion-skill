import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
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
  const safeCount = Math.max(assets.length, 2);
  const countFactor = Math.min(1.12, Math.max(0.86, safeCount / 10));
  const ringRadius = Math.min(width, height) * (0.2 + countFactor * 0.055);
  const ringPositions = distributeOnCircle(assets.length, ringRadius, seed + 11, -8);

  const enterEnd = Math.floor(durationInFrames * 0.22);
  const attachEnd = Math.floor(durationInFrames * 0.58);
  const rotateEnd = Math.floor(durationInFrames * 0.9);
  const finalStart = Math.floor(durationInFrames * 0.88);

  const cameraPush = phaseProgress(frame, 0, attachEnd);
  const cameraPushEase = Easing.inOut(Easing.cubic)(cameraPush);
  const cameraZ = interpolate(cameraPushEase, [0, 0.55, 1], [-1450, -700, -60], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const cameraRotateY = interpolate(cameraPushEase, [0, 1], [-12, -1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const cameraRotateX = interpolate(cameraPushEase, [0, 1], [-7, -0.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const ringTurn = phaseProgress(frame, enterEnd, rotateEnd);
  const ringTurnEase = Easing.inOut(Easing.quad)(ringTurn);
  const ringRotateY = interpolate(ringTurnEase, [0, 0.6, 1], [0, 62 * intensityBoost, 48 * intensityBoost], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const ringRotateX = interpolate(ringTurnEase, [0, 1], [-17, -5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const ringRotateZ = Math.sin(frame * 0.014) * 2.1;

  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const cardWidth = Math.min(width, height) * (safeCount <= 6 ? 0.48 : safeCount <= 10 ? 0.38 : 0.33);
  const cardHeight = cardWidth * 0.66;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translateZ(${cameraZ}px) rotateX(${cameraRotateX}deg) rotateY(${cameraRotateY}deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.01, 0.16])}
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
          const perCardDelay = index * Math.max(3, Math.floor(fps * 0.05));
          const enterProgress = phaseProgress(frame - perCardDelay, 0, enterEnd);
          const attachProgress = phaseProgress(frame - perCardDelay, Math.floor(enterEnd * 0.32), attachEnd);
          const enterEase = Easing.inOut(Easing.cubic)(enterProgress);

          const swirlAngle = (index / Math.max(assets.length, 1)) * Math.PI * 2;
          const preOrbitOffsetX = Math.cos(swirlAngle + frame * 0.019) * 120;
          const preOrbitOffsetY = Math.sin(swirlAngle + frame * 0.017) * 54;

          const entryX = interpolate(enterEase, [0, 1], [base.x * 2.1 + preOrbitOffsetX, base.x], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });
          const entryY = interpolate(enterEase, [0, 1], [base.y - 220 + preOrbitOffsetY, base.y], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });
          const entryZ = interpolate(enterEase, [0, 1], [base.z - 2100 * intensityBoost, base.z], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });

          const depthPulse = Math.sin((frame + index * 8) * 0.03) * 24 * attachProgress;
          const centerBias = Math.max(0, Math.cos(swirlAngle - (ringRotateY * Math.PI) / 180));
          const pullForward = interpolate(attachProgress, [0, 1], [0, 240 * centerBias]);
          const finalZ = entryZ + depthPulse + pullForward;
          const scale = interpolate(attachProgress, [0, 1], [0.78, 1.06], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });
          const depthScale = scale * (1 + (base.z / ringRadius) * 0.11);

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
              opacity={interpolate(enterEase, [0, 1], [0, 1]) * interpolate(attachProgress, [0, 1], [0.86, 1])}
              shadowStrength={1.05 + (1 - attachProgress) * 0.2}
              debugLabel={debug ? `orbit-${index}` : undefined}
            />
          );
        })}
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
