import type {MultiImageAsset, NormalizedMultiImageMotionRequest} from '../skill/schema';
import {MotionImage} from './MotionImage';

interface ImageCardProps {
  asset: MultiImageAsset;
  frameStyle: NormalizedMultiImageMotionRequest['theme']['frameStyle'];
  x: number;
  y: number;
  z?: number;
  scale?: number;
  rotateY?: number;
  width: number;
  height: number;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  asset,
  frameStyle,
  x,
  y,
  z,
  scale,
  rotateY,
  width,
  height
}) => {
  return (
    <MotionImage
      asset={asset}
      cardWidth={width}
      cardHeight={height}
      x={x}
      y={y}
      z={z}
      scale={scale}
      rotateY={rotateY}
      frameStyle={frameStyle}
    />
  );
};
