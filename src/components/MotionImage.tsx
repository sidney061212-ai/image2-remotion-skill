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
  highlight = false
}) => {
  const frame = getFrameStyle(frameStyle);
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
    outline: highlight ? '2px solid rgba(129, 230, 217, 0.9)' : 'none',
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
          display: 'block'
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
