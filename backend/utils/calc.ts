export const BASE_RATE = Number(process.env.BASE_RATE ?? '0.01');
export function computeReward(seconds: number, multiplier: number) {
  // Per brief: EffectiveRate = BASE_RATE / multiplier
  return (BASE_RATE / multiplier) * seconds;
}
export function clampMultiplier(m: number, max: number) {
  return Math.min(Math.max(1, m), max);
}
