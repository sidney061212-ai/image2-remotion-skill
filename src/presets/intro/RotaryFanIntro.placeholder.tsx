import type {MultiImagePresetProps} from '../types';
import {PlaceholderPresetView} from '../PlaceholderPresetView';

export const RotaryFanIntroPlaceholder: React.FC<MultiImagePresetProps> = (props) => {
  return <PlaceholderPresetView {...props} presetId="rotary-fan-intro" />;
};
