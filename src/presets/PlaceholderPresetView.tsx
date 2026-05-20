import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {distributeGrid} from '../motion/layout';
import type {MultiImagePresetProps} from './types';
import {MotionImage} from '../components/MotionImage';
import {PerspectiveStage} from '../components/PerspectiveStage';

interface PlaceholderPresetViewProps extends MultiImagePresetProps {
  presetId: string;
}

export const PlaceholderPresetView: React.FC<PlaceholderPresetViewProps> = ({
  assets,
  width,
  height,
  theme,
  debug,
  presetId
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const pulse = interpolate(frame % 90, [0, 45, 90], [0.95, 1, 0.95]);
  const positions = distributeGrid(Math.min(assets.length, 8), width * 0.76, height * 0.6, 4);
  const cardWidth = Math.min(width, height) * 0.22;
  const cardHeight = cardWidth * 0.66;

  return (
    <PerspectiveStage background={theme.background} cameraTransform="translateZ(0px)">
      {assets.slice(0, 8).map((asset, index) => {
        const pos = positions[index];
        return (
          <MotionImage
            key={`${asset.path}-${index}`}
            asset={asset}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            x={pos.x}
            y={pos.y}
            frameStyle={theme.frameStyle}
            scale={pulse}
            opacity={0.88}
            debugLabel={debug ? `placeholder-${index}` : undefined}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#f8fafc',
          width: Math.min(width * 0.78, 1000)
        }}
      >
        <div style={{fontSize: Math.round(width * 0.03), fontWeight: 700}}>{presetId}</div>
        <div style={{fontSize: Math.round(width * 0.018), marginTop: 18, opacity: 0.88}}>
          Placeholder preset - motionSpec implemented, animation pending.
        </div>
        <div style={{fontSize: Math.round(width * 0.013), marginTop: 14, opacity: 0.72}}>
          Duration: {durationInFrames} frames
        </div>
      </div>
    </PerspectiveStage>
  );
};
