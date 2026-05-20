import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
import {SafeText} from '../../components/SafeText';
import {distributeOnCircle} from '../../motion/layout';
import {phaseProgress, staggerProgress} from '../../motion/timeline';
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
  const ringRadius = Math.min(width, height) * 0.33;
  const ringPositions = distributeOnCircle(assets.length, ringRadius, seed, -20);

  const enterEnd = Math.floor(durationInFrames * 0.2);
  const attachEnd = Math.floor(durationInFrames * 0.55);
  const rotateEnd = Math.floor(durationInFrames * 0.85);
  const finalStart = Math.floor(durationInFrames * 0.82);

  const cameraZ = interpolate(frame, [0, attachEnd], [-960, -320], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const cameraRotateY = interpolate(frame, [0, rotateEnd], [-8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const ringRotateY = interpolate(frame, [0, rotateEnd], [0, 35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const intensityBoost = intensity === 'high' ? 1.25 : intensity === 'low' ? 0.85 : 1;
  const titleReveal = spring({
    frame: Math.max(0, frame - Math.floor(durationInFrames * 0.72)),
    fps,
    config: {damping: 18, mass: 0.9}
  });
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const cardWidth = Math.min(width, height) * 0.24;
  const cardHeight = cardWidth * 0.66;
  const enterSpread = Math.min(width, height) * 0.48;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translateZ(${cameraZ}px) rotateY(${cameraRotateY}deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0, 0.35])}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `rotateY(${ringRotateY}deg)`
        }}
      >
        {assets.map((asset, index) => {
          const base = ringPositions[index];
          const enterProgress = phaseProgress(frame, 0, enterEnd);
          const attachProgress = phaseProgress(frame, enterEnd, attachEnd);
          const stagger = staggerProgress(frame, index, 3, Math.max(12, imageHoldSeconds * fps * 0.24));

          const entryX = interpolate(enterProgress * stagger, [0, 1], [base.x * 1.4, base.x], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });
          const entryY = interpolate(enterProgress * stagger, [0, 1], [base.y - enterSpread * 0.1, base.y], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });
          const entryZ = interpolate(enterProgress * stagger, [0, 1], [base.z - 1200 * intensityBoost, base.z], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });

          const stickScale = interpolate(attachProgress, [0, 1], [0.84, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });

          return (
            <MotionImage
              key={`${asset.path}-${index}`}
              asset={asset}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              x={entryX}
              y={entryY}
              z={entryZ}
              rotateY={(base.rotateY ?? 0) + interpolate(enterProgress, [0, 1], [30, 0])}
              scale={stickScale * (1 + (base.z / ringRadius) * 0.08)}
              frameStyle={theme.frameStyle}
              opacity={interpolate(enterProgress * stagger, [0, 1], [0, 1])}
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
          transform: `translate(-50%, -50%) scale(${interpolate(titleReveal, [0, 1], [0.9, 1])})`,
          color: '#f8fafc',
          textAlign: 'center',
          width: Math.min(width * 0.66, 920),
          opacity: interpolate(titleReveal, [0, 1], [0, 1])
        }}
      >
        <SafeText
          value={text?.title ?? 'Creative Memories'}
          style={{fontSize: Math.round(width * 0.06), fontWeight: 700, letterSpacing: 1.2}}
        />
        <SafeText
          value={text?.subtitle}
          style={{fontSize: Math.round(width * 0.025), marginTop: 18, opacity: 0.84}}
        />
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
