import type {MultiImagePresetProps} from '../types';
import {PlaceholderPresetView} from '../PlaceholderPresetView';

export const CoverflowFocusPlaceholder: React.FC<MultiImagePresetProps> = (props) => {
  return <PlaceholderPresetView {...props} presetId="coverflow-focus" />;
};
