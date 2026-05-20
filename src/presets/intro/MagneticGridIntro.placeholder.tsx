import type {MultiImagePresetProps} from '../types';
import {PlaceholderPresetView} from '../PlaceholderPresetView';

export const MagneticGridIntroPlaceholder: React.FC<MultiImagePresetProps> = (props) => {
  return <PlaceholderPresetView {...props} presetId="magnetic-grid-intro" />;
};
