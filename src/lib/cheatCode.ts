// Sequence: A, C, Up, B, Up, B, A, Down (Genesis controller → keyboard)
export const CHEAT_SEQUENCE = [
  'a', 'c', 'ArrowUp', 'b', 'ArrowUp', 'b', 'a', 'ArrowDown',
] as const;

export type CheatKey = (typeof CHEAT_SEQUENCE)[number];
