import { useReducedMotion } from 'react-native-reanimated';

/** true quando o sistema pede "reduzir movimento": as animações devem ser desligadas. */
export function useReduceMotion(): boolean {
  return useReducedMotion();
}
