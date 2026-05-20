import type {CSSProperties, PropsWithChildren} from 'react';
import {AbsoluteFill} from 'remotion';
import type {NormalizedMultiImageMotionRequest} from '../skill/schema';
import {getBackgroundStyle} from '../styles/themes';

interface PerspectiveStageProps extends PropsWithChildren {
  background: NormalizedMultiImageMotionRequest['theme']['background'];
  cameraTransform?: string;
  overlayOpacity?: number;
}

export const PerspectiveStage: React.FC<PerspectiveStageProps> = ({
  background,
  cameraTransform,
  overlayOpacity = 0,
  children
}) => {
  const cameraStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    transformStyle: 'preserve-3d',
    transform: cameraTransform
  };

  return (
    <AbsoluteFill style={{...getBackgroundStyle(background), overflow: 'hidden'}}>
      <AbsoluteFill style={{perspective: 2200, transformStyle: 'preserve-3d'}}>
        <div style={cameraStyle}>{children}</div>
      </AbsoluteFill>
      {overlayOpacity > 0 ? (
        <AbsoluteFill
          style={{
            background: `rgba(0, 0, 0, ${overlayOpacity})`
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
