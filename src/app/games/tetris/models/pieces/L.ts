import { Position } from '../position';

export type L = Position[];

/**
 *     *
 *     *
 *   * *
 */
export const UP_L: L = [
  { x: 6, y: 1 },
  { x: 6, y: 2 },
  { x: 6, y: 3 },
  { x: 5, y: 3 },
];

/**
 *   *
 *   * * *
 */
export const RIGHT_L: L = [
  { x: 5, y: 2 },
  { x: 6, y: 2 },
  { x: 7, y: 2 },
  { x: 5, y: 1 },
];

/**
 *   * *
 *   *
 *   *
 */
export const DOWN_L: L = [
  { x: 5, y: 1 },
  { x: 5, y: 2 },
  { x: 5, y: 3 },
  { x: 6, y: 1 },
];

/**
 *   * * *
 *       *
 */
export const LEFT_L: L = [
  { x: 5, y: 1 },
  { x: 6, y: 1 },
  { x: 7, y: 1 },
  { x: 7, y: 2 },
];

export const L_PIECES = {
  UP: UP_L,
  RIGHT: RIGHT_L,
  DOWN: DOWN_L,
  LEFT: LEFT_L,
};
