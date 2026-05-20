import {Composition} from 'remotion';
import {MultiImageComposition} from './compositions/MultiImageComposition';
import {normalizeRequest} from './skill/normalizeRequest';
import type {MultiImageMotionRequest} from './skill/schema';

const defaultRequest: MultiImageMotionRequest = {
  version: '1.0',
  assets: [{path: '/sample/image-01.png'}, {path: '/sample/image-02.png'}],
  output: {
    aspectRatio: '16:9'
  },
  motion: {
    useCase: 'intro'
  },
  text: {
    title: 'Image2 Remotion Skill'
  }
};

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Image2RemotionSkill"
        component={MultiImageComposition as unknown as React.FC<Record<string, unknown>>}
        defaultProps={defaultRequest}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={({props}) => {
          const normalized = normalizeRequest(props as unknown as MultiImageMotionRequest);
          return {
            durationInFrames: Math.round(normalized.output.durationSeconds * normalized.output.fps),
            fps: normalized.output.fps,
            width: normalized.output.width,
            height: normalized.output.height
          };
        }}
      />
    </>
  );
};
