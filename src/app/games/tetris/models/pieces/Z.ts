import { Position } from "../position";

export type Z = Position[];

/**
 *     *
 *   * *
 *   *
 */
export const UP_Z: Z = [
  { x: 6, y: 1 },
  { x: 6, y: 2 },
  { x: 5, y: 2 },
  { x: 5, y: 3 }
];

/**
 *   * *
 *     * *
 */
export const RIGHT_Z: Z = [
  { x: 4, y: 1 },
  { x: 5, y: 1 },
  { x: 5, y: 2 },
  { x: 6, y: 2 }
];

export const Z_PIECES = {
  UP: UP_Z,
  RIGHT: RIGHT_Z,
  DOWN: UP_Z,
  LEFT: RIGHT_Z
};
