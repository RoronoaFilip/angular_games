import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TetrisGameState } from './TetrisGameState';


export const selectTetrisState = createFeatureSelector<TetrisGameState>('tetris');

export const currentTetrisPiece = createSelector(
  selectTetrisState,
  (state: TetrisGameState) => state.currentPiece
);

export const nextTetrisPiece = createSelector(
  selectTetrisState,
  (state: TetrisGameState) => state.nextPiece
);

export const passedTetrisPieces = createSelector(
  selectTetrisState,
  (state: TetrisGameState) => state.passedPieces
);
