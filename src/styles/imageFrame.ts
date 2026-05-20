import type {CSSProperties} from 'react';
import type {NormalizedMultiImageMotionRequest} from '../skill/schema';

type FrameStyle = NormalizedMultiImageMotionRequest['theme']['frameStyle'];

const FRAME_STYLES: Record<FrameStyle, CSSProperties> = {
  none: {
    border: 'none',
    borderRadius: 18,
    boxShadow: '0 14px 30px rgba(0, 0, 0, 0.35)'
  },
  'thin-border': {
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: 18,
    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)'
  },
  'glass-card': {
    border: '1px solid rgba(255, 255, 255, 0.35)',
    borderRadius: 20,
    boxShadow: '0 20px 42px rgba(4, 10, 24, 0.5)',
    backdropFilter: 'blur(6px)'
  },
  polaroid: {
    border: '10px solid rgba(255, 255, 255, 0.95)',
    borderBottom: '26px solid rgba(255, 255, 255, 0.95)',
    borderRadius: 6,
    boxShadow: '0 20px 36px rgba(0, 0, 0, 0.35)'
  },
  poster: {
    border: '2px solid rgba(17, 24, 39, 0.85)',
    borderRadius: 8,
    boxShadow: '0 14px 28px rgba(0, 0, 0, 0.45)'
  }
};

export const getFrameStyle = (frameStyle: FrameStyle): CSSProperties => {
  return FRAME_STYLES[frameStyle];
};
