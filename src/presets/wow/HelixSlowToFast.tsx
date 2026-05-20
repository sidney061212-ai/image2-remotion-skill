import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FinalComposition} from '../../components/FinalComposition';
import {MotionImage} from '../../components/MotionImage';
import {PerspectiveStage} from '../../components/PerspectiveStage';
import {distributeHelix} from '../../motion/layout';
import {phaseProgress} from '../../motion/timeline';
import type {MultiImagePresetProps} from '../types';

export const HelixSlowToFast: React.FC<MultiImagePresetProps> = ({
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

  // Script: starts readable and slow, accelerates mid-way, then decelerates into final composition.
  const radius = Math.min(width, height) * 0.34;
  const spacing = Math.min(width, height) * 0.34;
  const helix = distributeHelix(assets.length, radius, spacing, seed + 331);

  const travelProgress = phaseProgress(frame, 0, Math.floor(durationInFrames * 0.88));
  const acceleration = interpolate(travelProgress, [0, 0.34, 0.76, 1], [0, 0.18, 0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const cameraZ = interpolate(acceleration, [0, 1], [-760, spacing * assets.length * 1.16]);
  const spin = interpolate(acceleration, [0, 1], [0, intensity === 'high' ? 520 : 440]);
  const roll = interpolate(acceleration, [0, 1], [0, intensity === 'high' ? 12 : 8]);

  const finalStart = Math.floor(durationInFrames * 0.88);
  const finalProgress = phaseProgress(frame, finalStart, durationInFrames - 1);

  const cardWidth = Math.min(width, height) * 0.26;
  const cardHeight = cardWidth * 0.66;

  return (
    <PerspectiveStage
      background={theme.background}
      cameraTransform={`translate3d(0px, 0px, ${cameraZ}px) rotateZ(${roll}deg)`}
      overlayOpacity={interpolate(finalProgress, [0, 1], [0.05, 0.18])}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `rotateZ(${spin}deg)`
        }}
      >
        {assets.map((asset, index) => {
          const p = helix[index];
          const relative = p.z + cameraZ;
          const focus = Math.max(0, 1 - Math.min(1, Math.abs(relative) / (spacing * 0.56)));

          return (
            <MotionImage
              key={`${asset.path}-${index}`}
              asset={asset}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              x={p.x}
              y={p.y + Math.sin((frame + index * 4) * 0.03) * 16}
              z={p.z}
              rotateX={(p.rotateX ?? 0) + Math.sin((frame + index * 8) * 0.012) * 4}
              rotateY={(p.rotateY ?? 0) + spin * 0.18}
              scale={0.52 + focus * 1.1}
              opacity={0.26 + focus * 0.74}
              frameStyle={theme.frameStyle}
              blurPx={Math.max(0, (1 - focus) * 4.4)}
              highlight={focus > 0.82}
              shadowStrength={1 + focus * 0.24}
              debugLabel={debug ? `helix-sf-${index}` : undefined}
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
