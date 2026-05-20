import type {MultiImagePresetProps} from '../types';
import {PlaceholderPresetView} from '../PlaceholderPresetView';

export const DropFlipIntroPlaceholder: React.FC<MultiImagePresetProps> = (props) => {
  return <PlaceholderPresetView {...props} presetId="drop-flip-intro" />;
};
