export const BASE_RATE = Number(process.env.BASE_RATE ?? '0.01');
export function computeReward(seconds: number, multiplier: number) {
  // Correct formula: EffectiveRate = BASE_RATE * multiplier
  // Example: 0.01 * 3 = 0.03 tokens/sec
  // For 4 hours (14400 sec): 0.03 * 14400 = 432 tokens
  return BASE_RATE * multiplier * seconds;
}
export function clampMultiplier(m: number, max: number) {
  return Math.min(Math.max(1, m), max);
}
