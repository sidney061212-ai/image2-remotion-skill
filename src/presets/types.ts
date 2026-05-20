import type {ReactNode} from 'react';
import type {
  FinalComposition,
  MotionIntensity,
  MultiImageAsset,
  MultiImageMotionPreset,
  MultiImageUseCase,
  NormalizedMultiImageMotionRequest
} from '../skill/schema';

export interface MultiImagePresetProps {
  assets: MultiImageAsset[];
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  intensity: MotionIntensity;
  imageHoldSeconds: number;
  finalComposition: FinalComposition;
  text?: {
    title?: string;
    subtitle?: string;
    caption?: string;
  };
  theme: NormalizedMultiImageMotionRequest['theme'];
  seed: number;
  debug: boolean;
}

export interface MultiImagePresetDefinition {
  id: MultiImageMotionPreset;
  useCase: MultiImageUseCase;
  minImages: number;
  recommendedImages: {
    min: number;
    max: number;
  };
  defaultDurationSeconds: number;
  supportsFinalComposition: FinalComposition[];
  description: string;
  implementationStatus: 'implemented' | 'placeholder';
  motionSpec: {
    spatialStructure: string;
    entranceLogic: string;
    cameraPath: string;
    imageSequencing: string;
    transitionBehavior: string;
    finalComposition: string;
  };
  acceptanceCriteria: string[];
  Component: React.FC<MultiImagePresetProps>;
  debugBadge?: ReactNode;
}
