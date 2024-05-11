import { createAction, props } from '@ngrx/store';
import { Piece } from '../models/piece';

export const setCurrentPiece = createAction(
  '[Tetris] Set Current Piece',
  props<{ piece: Piece }>()
);

export const setNextPiece = createAction(
  '[Tetris] Set Next Piece',
  props<{ nextPiece: Piece }>()
);

export const addPassedPiece = createAction(
  '[Tetris] Add Passed Piece',
  props<{ piece: Piece }>()
);

export const setPassedPieces = createAction(
  '[Tetris] Set Passed Pieces',
  props<{ pieces: Piece[] }>()
);
