import type {CSSProperties} from 'react';
import type {NormalizedMultiImageMotionRequest} from '../skill/schema';

type BackgroundToken = NormalizedMultiImageMotionRequest['theme']['background'];

const BACKGROUNDS: Record<BackgroundToken, CSSProperties> = {
  'dark-gradient': {
    background: 'radial-gradient(circle at 20% 20%, #2f3b53 0%, #111827 42%, #030712 100%)'
  },
  'light-clean': {
    background: 'linear-gradient(145deg, #f7fbff 0%, #e2e8f0 52%, #d8dee9 100%)'
  },
  glass: {
    background: 'linear-gradient(155deg, rgba(20,30,48,0.95) 0%, rgba(36,59,85,0.9) 40%, rgba(26,42,108,0.85) 100%)'
  },
  'deep-space': {
    background: 'radial-gradient(circle at 50% -20%, #243b55 0%, #141e30 40%, #02040b 100%)'
  },
  paper: {
    background:
      'repeating-linear-gradient(0deg, #f6f1e8 0px, #f6f1e8 28px, #ece6da 29px, #ece6da 30px), linear-gradient(180deg, #fffaf0 0%, #f4eee3 100%)'
  }
};

export const getBackgroundStyle = (background: BackgroundToken): CSSProperties => {
  return BACKGROUNDS[background];
};
