import {staticFile} from 'remotion';
import type {MultiImageAsset} from '../skill/schema';

export const resolveAssetPath = (asset: MultiImageAsset): string => {
  const path = asset.path.trim();

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/')) {
    return staticFile(path.replace(/^\//, ''));
  }

  return staticFile(path);
};
