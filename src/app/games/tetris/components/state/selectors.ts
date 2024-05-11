import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TetrisGameState } from './TetrisGameState';


export const selectTetrisState = createFeatureSelector<TetrisGameState>('tetris');

export const selectCurrentPiece = createSelector(
  selectTetrisState,
  (state: TetrisGameState) => state.currentPiece
);

export const selectNextPiece = createSelector(
  selectTetrisState,
  (state: TetrisGameState) => state.nextPiece
);

export const selectPassedPieces = createSelector(
  selectTetrisState,
  (state: TetrisGameState) => state.passedPieces
);
