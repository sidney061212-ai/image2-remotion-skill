import type {CSSProperties} from 'react';
import type {NormalizedMultiImageMotionRequest} from '../skill/schema';

type BackgroundToken = NormalizedMultiImageMotionRequest['theme']['background'];

const BACKGROUNDS: Record<BackgroundToken, CSSProperties> = {
  black: {
    background: '#000000'
  },
  transparent: {
    background: 'transparent'
  }
};

export const getBackgroundStyle = (background: BackgroundToken): CSSProperties => {
  return BACKGROUNDS[background];
};
