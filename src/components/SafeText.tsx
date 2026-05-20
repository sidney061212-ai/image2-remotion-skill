import type {CSSProperties} from 'react';

interface SafeTextProps {
  value?: string;
  style?: CSSProperties;
}

export const SafeText: React.FC<SafeTextProps> = ({value, style}) => {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return <div style={style}>{value}</div>;
};
