import {interpolate} from 'remotion';
import type {
  FinalComposition as FinalCompositionMode,
  MultiImageAsset,
  NormalizedMultiImageMotionRequest
} from '../skill/schema';
import {distributeGrid, distributeOnCircle} from '../motion/layout';
import {clamp01} from '../motion/timeline';
import {MotionImage} from './MotionImage';
import {SafeText} from './SafeText';

interface FinalCompositionProps {
  assets: MultiImageAsset[];
  mode: FinalCompositionMode;
  progress: number;
  width: number;
  height: number;
  text?: {
    title?: string;
    subtitle?: string;
    caption?: string;
  };
  theme: NormalizedMultiImageMotionRequest['theme'];
  seed: number;
}

export const FinalComposition: React.FC<FinalCompositionProps> = ({
  assets,
  mode,
  progress,
  width,
  height,
  text,
  theme,
  seed
}) => {
  const p = clamp01(progress);
  if (p <= 0) {
    return null;
  }

  const baseOpacity = interpolate(p, [0, 1], [0, 1]);
  const cardWidth = Math.min(width, height) * 0.24;
  const cardHeight = cardWidth * 0.66;
  const previewAssets = assets.slice(0, 12);

  const renderGrid = () => {
    const positions = distributeGrid(previewAssets.length, width * 0.78, height * 0.66, 4);
    return previewAssets.map((asset, index) => {
      const pos = positions[index];
      return (
        <MotionImage
          key={`${asset.path}-${index}`}
          asset={asset}
          cardWidth={cardWidth * 0.8}
          cardHeight={cardHeight * 0.8}
          x={pos.x}
          y={pos.y}
          z={0}
          scale={interpolate(p, [0, 1], [0.92, 1])}
          frameStyle={theme.frameStyle}
          opacity={baseOpacity}
        />
      );
    });
  };

  const renderOrbit = () => {
    const radius = Math.min(width, height) * 0.3;
    const positions = distributeOnCircle(previewAssets.length, radius, seed + 99);

    return previewAssets.map((asset, index) => {
      const pos = positions[index];
      return (
        <MotionImage
          key={`${asset.path}-${index}`}
          asset={asset}
          cardWidth={cardWidth * 0.74}
          cardHeight={cardHeight * 0.74}
          x={pos.x}
          y={pos.y}
          z={pos.z * 0.45}
          rotateY={pos.rotateY}
          scale={interpolate(p, [0, 1], [0.9, 1])}
          frameStyle={theme.frameStyle}
          opacity={baseOpacity}
        />
      );
    });
  };

  const renderStack = () => {
    return previewAssets.slice(0, 6).map((asset, index) => {
      const offset = (index - 2.5) * 36;
      return (
        <MotionImage
          key={`${asset.path}-${index}`}
          asset={asset}
          cardWidth={cardWidth * 0.9}
          cardHeight={cardHeight * 0.9}
          x={offset}
          y={offset * 0.26}
          z={-index * 20}
          rotateZ={offset * 0.08}
          scale={interpolate(p, [0, 1], [0.85, 1])}
          frameStyle={theme.frameStyle}
          opacity={baseOpacity}
        />
      );
    });
  };

  const renderMainFocus = () => {
    const main = previewAssets[0];
    const side = previewAssets.slice(1, 6);

    return (
      <>
        {main ? (
          <MotionImage
            asset={main}
            cardWidth={cardWidth * 1.4}
            cardHeight={cardHeight * 1.4}
            x={0}
            y={-20}
            z={40}
            scale={interpolate(p, [0, 1], [0.9, 1])}
            frameStyle={theme.frameStyle}
            opacity={baseOpacity}
            highlight
          />
        ) : null}
        {side.map((asset, index) => {
          const direction = index % 2 === 0 ? -1 : 1;
          const layer = Math.floor(index / 2) + 1;

          return (
            <MotionImage
              key={`${asset.path}-${index}`}
              asset={asset}
              cardWidth={cardWidth * 0.6}
              cardHeight={cardHeight * 0.6}
              x={direction * (cardWidth * 0.95)}
              y={-140 + layer * 110}
              z={-layer * 10}
              scale={interpolate(p, [0, 1], [0.85, 1])}
              frameStyle={theme.frameStyle}
              opacity={baseOpacity}
            />
          );
        })}
      </>
    );
  };

  const renderTitleCenter = () => {
    return (
      <>
        {renderOrbit()}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
            textAlign: 'center',
            color: '#f8fafc',
            width: Math.min(width * 0.7, 920),
            opacity: baseOpacity
          }}
        >
          <SafeText
            value={text?.title ?? 'Final Composition'}
            style={{fontSize: Math.round(width * 0.05), fontWeight: 700, letterSpacing: 1.2}}
          />
          <SafeText
            value={text?.subtitle}
            style={{fontSize: Math.round(width * 0.024), marginTop: 18, opacity: 0.82}}
          />
        </div>
      </>
    );
  };

  return (
    <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', pointerEvents: 'none'}}>
      {mode === 'grid' ? renderGrid() : null}
      {mode === 'orbit' ? renderOrbit() : null}
      {mode === 'stack' ? renderStack() : null}
      {mode === 'main-focus' ? renderMainFocus() : null}
      {mode === 'title-center' ? renderTitleCenter() : null}
    </div>
  );
};
