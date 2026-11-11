import type { ReactNode } from "react";
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'home'
  | 'search'
  | 'heart'
  | 'heart-filled'
  | 'download'
  | 'check'
  | 'gear'
  | 'play'
  | 'pause'
  | 'close'
  | 'moon'
  | 'sun'
  | 'back'
  | 'more'
  | 'quiz'
  | 'bell'
  | 'egg'
  | 'lock'
  | 'unlock'
  | 'chevron-down'
  | 'chevron-right'
  | 'speaker'
  | 'megaphone'
  | 'thumbs-up'
  | 'book'
  | 'video'
  | 'headphones'
  | 'series';

type Props = { name: IconName; size?: number; color?: string; strokeWidth?: number };

/** Ícones de traço desenhados para o Folheia (24×24). */
export function Icon({ name, size = 24, color = '#1C2333', strokeWidth = 2.2 }: Props) {
  const s = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const f = { fill: color };
  let body: ReactNode;
  switch (name) {
    case 'home':
      body = <Path d="M3 11 12 3.5 21 11M5.5 9v10.5h4.5v-6h4v6h4.5V9" {...s} />;
      break;
    case 'search':
      body = (
        <>
          <Circle cx={10.5} cy={10.5} r={6.5} {...s} />
          <Path d="M15.5 15.5 21 21" {...s} />
        </>
      );
      break;
    case 'heart':
    case 'heart-filled':
      body = (
        <Path
          d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"
          {...s}
          fill={name === 'heart-filled' ? color : 'none'}
        />
      );
      break;
    case 'download':
      body = <Path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5M4 15.5v3.5h16v-3.5" {...s} />;
      break;
    case 'check':
      body = <Path d="M4.5 12.5 9.5 17.5 19.5 6.5" {...s} />;
      break;
    case 'gear':
      body = (
        <>
          <Circle cx={12} cy={12} r={3.2} {...s} />
          <Path
            d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"
            {...s}
          />
          <Circle cx={12} cy={12} r={7} {...s} />
        </>
      );
      break;
    case 'play':
      body = <Path d="M8 5.5v13l10.5-6.5L8 5.5Z" {...f} />;
      break;
    case 'pause':
      body = (
        <>
          <Rect x={6.5} y={5} width={4} height={14} rx={1.4} {...f} />
          <Rect x={13.5} y={5} width={4} height={14} rx={1.4} {...f} />
        </>
      );
      break;
    case 'close':
      body = <Path d="M6 6l12 12M18 6 6 18" {...s} />;
      break;
    case 'moon':
      body = <Path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" {...s} />;
      break;
    case 'sun':
      body = (
        <>
          <Circle cx={12} cy={12} r={4} {...s} />
          <Path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" {...s} />
        </>
      );
      break;
    case 'back':
      body = <Path d="M19 12H5M11 5.5 4.5 12l6.5 6.5" {...s} />;
      break;
    case 'more':
      body = (
        <>
          <Circle cx={5} cy={12} r={2} {...f} />
          <Circle cx={12} cy={12} r={2} {...f} />
          <Circle cx={19} cy={12} r={2} {...f} />
        </>
      );
      break;
    case 'quiz':
      body = (
        <>
          <Rect x={3.5} y={3.5} width={17} height={17} rx={5} {...s} />
          <Path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1 1-1.1 1.8v.3" {...s} />
          <Circle cx={12} cy={17} r={1.2} {...f} />
        </>
      );
      break;
    case 'bell':
      body = <Path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2H4.5l1.5-2ZM10 20.5a2 2 0 0 0 4 0" {...s} />;
      break;
    case 'egg':
      body = <Path d="M12 3c-3.6 0-6.5 5.4-6.5 9.8A6.5 6.5 0 0 0 12 21a6.5 6.5 0 0 0 6.5-8.2C18.5 8.4 15.6 3 12 3Z" {...s} />;
      break;
    case 'lock':
    case 'unlock':
      body = (
        <>
          <Rect x={5} y={10.5} width={14} height={10} rx={3} {...s} />
          <Path d={name === 'lock' ? 'M8 10.5V8a4 4 0 0 1 8 0v2.5' : 'M8 10.5V7.5a4 4 0 0 1 7.6-1.7'} {...s} />
          <Circle cx={12} cy={15.5} r={1.4} {...f} />
        </>
      );
      break;
    case 'chevron-down':
      body = <Path d="M6 9.5 12 15.5 18 9.5" {...s} />;
      break;
    case 'chevron-right':
      body = <Path d="M9.5 6 15.5 12 9.5 18" {...s} />;
      break;
    case 'speaker':
      body = <Path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5ZM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" {...s} />;
      break;
    case 'megaphone':
      body = <Path d="M4 10v4h3l8 4.5v-13L7 10H4ZM7 14l1.5 5.5M18.5 9.5a3.5 3.5 0 0 1 0 5" {...s} />;
      break;
    case 'thumbs-up':
      body = <Path d="M7.5 20.5h-3v-9h3v9ZM7.5 11.5 11 4a2 2 0 0 1 2.5 2.2L13 9.5h5.5a2 2 0 0 1 2 2.4l-1.4 6.5a2.6 2.6 0 0 1-2.6 2.1H7.5" {...s} />;
      break;
    case 'book':
      body = <Path d="M12 6.5C10 5 7 4.5 3.5 5v13.5C7 18 10 18.5 12 20m0-13.5C14 5 17 4.5 20.5 5v13.5C17 18 14 18.5 12 20m0-13.5V20" {...s} />;
      break;
    case 'video':
      body = (
        <>
          <Rect x={3.5} y={6} width={17} height={13} rx={3} {...s} />
          <Path d="M10.5 10v5l4-2.5-4-2.5ZM3.5 6l2-2.5h13l2 2.5" {...s} />
        </>
      );
      break;
    case 'headphones':
      body = <Path d="M4 17v-4a8 8 0 0 1 16 0v4M4 15h3v5.5H5.5A1.5 1.5 0 0 1 4 19v-4ZM20 15h-3v5.5h1.5A1.5 1.5 0 0 0 20 19v-4Z" {...s} />;
      break;
    case 'series':
      body = <Path d="M4.5 4.5h4v15h-4zM10 4.5h4v15h-4zM15.5 5.5l3.8-1 3 14.5-3.8 1z" {...s} />;
      break;
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {body}
    </Svg>
  );
}
