import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { Caca } from '@/components/caca';
import type { Scene as SceneData } from '@/data/books';

type Props = { scene: SceneData; dim?: boolean; style?: StyleProp<ViewStyle> };

/** Ilustração de página montada com formas simples (protótipo até termos as ilustrações finais). */
export function Scene({ scene, dim, style }: Props) {
  const items = scene.items ?? [];
  return (
    <View style={[styles.wrap, { backgroundColor: scene.sky }, style]} accessible={false}>
      <Svg width="100%" height="100%" viewBox="0 0 300 220" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFill}>
        {items.includes('stars') &&
          [
            [30, 30],
            [80, 60],
            [140, 22],
            [200, 50],
            [260, 28],
            [240, 80],
            [110, 90],
          ].map(([x, y], i) => <Circle key={i} cx={x} cy={y} r={i % 2 ? 1.8 : 2.6} fill="#FFF6D5" />)}
        {items.includes('sun') && <Circle cx={250} cy={45} r={24} fill="#FFD36E" />}
        {items.includes('moon') && (
          <G>
            <Circle cx={240} cy={50} r={22} fill="#FFF3C4" />
            <Circle cx={232} cy={44} r={4} fill="#EADFA8" />
            <Circle cx={248} cy={58} r={3} fill="#EADFA8" />
          </G>
        )}
        {items.includes('planet') && (
          <G>
            <Circle cx={60} cy={60} r={20} fill="#FFB627" />
            <Ellipse cx={60} cy={60} rx={34} ry={8} stroke="#FFD36E" strokeWidth={4} fill="none" />
          </G>
        )}
        {items.includes('cloud') && <Cloud x={50} y={45} />}
        {items.includes('cloud') && <Cloud x={170} y={75} small />}
        {items.includes('hills') && (
          <Path d="M0 170 Q60 120 120 160 Q180 110 300 150 V220 H0 Z" fill="#000" opacity={0.12} />
        )}
        {scene.ground && <Path d="M0 175 Q150 160 300 175 V220 H0 Z" fill={scene.ground} />}
        {items.includes('waves') && (
          <G opacity={0.55}>
            <Path d="M0 190 Q25 182 50 190 T100 190 T150 190 T200 190 T250 190 T300 190" stroke="#fff" strokeWidth={3} fill="none" />
            <Path d="M0 205 Q25 197 50 205 T100 205 T150 205 T200 205 T250 205 T300 205" stroke="#fff" strokeWidth={3} fill="none" />
          </G>
        )}
        {items.includes('tree') && <Tree x={40} />}
        {items.includes('house') && <House x={215} />}
        {items.includes('flowers') &&
          [70, 110, 190, 230].map((x, i) => (
            <G key={i}>
              <Path d={`M${x} 185 V172`} stroke="#3E8B48" strokeWidth={2} />
              <Circle cx={x} cy={170} r={5} fill={['#FF8FA3', '#FFD36E', '#C7A6FF', '#FFFFFF'][i]} />
              <Circle cx={x} cy={170} r={1.8} fill="#FFB627" />
            </G>
          ))}
        {dim && <Rect x={0} y={0} width={300} height={220} fill="#000" opacity={0.35} />}
      </Svg>
      {scene.hero === 'caca' ? (
        <Caca variant="head" size={120} style={[{ marginTop: 10 }, dim && { opacity: 0.8 }]} />
      ) : scene.hero ? (
        <Text style={[styles.hero, dim && { opacity: 0.8 }]} accessibilityElementsHidden>
          {scene.hero}
        </Text>
      ) : null}
    </View>
  );
}

function Cloud({ x, y, small }: { x: number; y: number; small?: boolean }) {
  const k = small ? 0.7 : 1;
  return (
    <G transform={`translate(${x} ${y}) scale(${k})`}>
      <Ellipse cx={0} cy={0} rx={22} ry={12} fill="#fff" opacity={0.9} />
      <Ellipse cx={18} cy={-6} rx={16} ry={12} fill="#fff" opacity={0.9} />
      <Ellipse cx={34} cy={2} rx={16} ry={10} fill="#fff" opacity={0.9} />
    </G>
  );
}

function Tree({ x }: { x: number }) {
  return (
    <G>
      <Rect x={x - 5} y={140} width={10} height={40} rx={3} fill="#7A5232" />
      <Circle cx={x} cy={128} r={26} fill="#3E8B48" />
      <Circle cx={x + 16} cy={140} r={16} fill="#4FA35A" />
    </G>
  );
}

function House({ x }: { x: number }) {
  return (
    <G>
      <Rect x={x} y={135} width={50} height={42} fill="#FBE7DF" />
      <Path d={`M${x - 6} 138 L${x + 25} 112 L${x + 56} 138 Z`} fill="#B8471F" />
      <Rect x={x + 19} y={152} width={12} height={25} fill="#7A5232" />
      <Rect x={x + 5} y={145} width={10} height={10} fill="#FFD36E" />
    </G>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  hero: { fontSize: 84, lineHeight: 100, marginTop: 10 },
});
