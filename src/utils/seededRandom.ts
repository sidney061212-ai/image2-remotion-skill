export interface SeededRandom {
  (): number;
}

export const createSeededRandom = (seed: number): SeededRandom => {
  let state = Math.floor(seed) % 2147483647;
  if (state <= 0) {
    state += 2147483646;
  }

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};
