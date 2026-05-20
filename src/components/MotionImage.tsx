import type {CSSProperties} from 'react';
import {Img} from 'remotion';
import type {MultiImageAsset, NormalizedMultiImageMotionRequest} from '../skill/schema';
import {getFrameStyle} from '../styles/imageFrame';
import {resolveAssetPath} from '../utils/asset';

interface MotionImageProps {
  asset: MultiImageAsset;
  cardWidth: number;
  cardHeight: number;
  x: number;
  y: number;
  z?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  opacity?: number;
  frameStyle: NormalizedMultiImageMotionRequest['theme']['frameStyle'];
  debugLabel?: string;
  highlight?: boolean;
  blurPx?: number;
  shadowStrength?: number;
}

export const MotionImage: React.FC<MotionImageProps> = ({
  asset,
  cardWidth,
  cardHeight,
  x,
  y,
  z = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  scale = 1,
  opacity = 1,
  frameStyle,
  debugLabel,
  highlight = false,
  blurPx = 0,
  shadowStrength = 1
}) => {
  const frame = getFrameStyle(frameStyle);
  const normalizedScale = Math.max(0.5, scale);
  const depthDistance = Math.min(Math.abs(z), 2200);
  const shadowOpacity = Math.min(0.62, (0.24 + depthDistance / 3800) * shadowStrength);
  const highlightOpacity = highlight ? 0.9 : 0;
  const containerStyle: CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: cardWidth,
    height: cardHeight,
    overflow: 'hidden',
    opacity,
    transformStyle: 'preserve-3d',
    transform: [
      `translate3d(${x - cardWidth / 2}px, ${y - cardHeight / 2}px, ${z}px)`,
      `rotateX(${rotateX}deg)`,
      `rotateY(${rotateY}deg)`,
      `rotateZ(${rotateZ}deg)`,
      `scale(${scale})`
    ].join(' '),
    boxShadow: [
      `0 ${Math.round(14 * normalizedScale)}px ${Math.round(36 * normalizedScale)}px rgba(0, 0, 0, ${shadowOpacity})`,
      highlight ? '0 0 0 1px rgba(129, 230, 217, 0.85)' : '',
      highlight ? '0 0 26px rgba(45, 212, 191, 0.45)' : ''
    ]
      .filter(Boolean)
      .join(', '),
    outline: highlight ? '2px solid rgba(129, 230, 217, 0.78)' : 'none',
    willChange: 'transform, opacity',
    ...frame
  };

  return (
    <div style={containerStyle}>
      <Img
        src={resolveAssetPath(asset)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
          transform: 'scale(1.02)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(158deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0) 62%, rgba(0,0,0,0.2) 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle at 16% 12%, rgba(255,255,255,${0.22 + highlightOpacity * 0.18}) 0%, rgba(255,255,255,0) 48%)`
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: highlightOpacity,
          background:
            'linear-gradient(130deg, rgba(45,212,191,0.16) 0%, rgba(45,212,191,0) 45%, rgba(56,189,248,0.22) 100%)'
        }}
      />
      {debugLabel ? (
        <div
          style={{
            position: 'absolute',
            left: 8,
            bottom: 8,
            background: 'rgba(0, 0, 0, 0.6)',
            color: '#f8fafc',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 14,
            padding: '4px 8px',
            borderRadius: 8
          }}
        >
          {debugLabel}
        </div>
      ) : null}
    </div>
  );
};
