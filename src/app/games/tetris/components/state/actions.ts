import { createAction, props } from '@ngrx/store';
import { Piece } from '../../models/pieces/piece';

export const moveCurrentPiece = createAction(
  '[Tetris] Move Current Piece',
  props<{ piece: Piece }>()
);

export const setCurrentPiece = createAction(
  '[Tetris] Set Current Piece'
);

export const setNextPiece = createAction(
  '[Tetris] Set Next Piece',
  props<{ nextPiece: Piece }>()
);
