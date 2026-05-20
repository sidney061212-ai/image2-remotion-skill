import type {MultiImagePresetProps} from '../types';
import {PlaceholderPresetView} from '../PlaceholderPresetView';

export const PageFlipGalleryPlaceholder: React.FC<MultiImagePresetProps> = (props) => {
  return <PlaceholderPresetView {...props} presetId="page-flip-gallery" />;
};
