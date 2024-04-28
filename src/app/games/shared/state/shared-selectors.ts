import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SharedAppState } from './SharedAppState';

const selectSharedState = createFeatureSelector<SharedAppState>('shared');

export const selectIsPaused = createSelector(
  selectSharedState,
  (state: SharedAppState) => state.isPaused
);

export const selectIsGameOver = createSelector(
  selectSharedState,
  (state: SharedAppState) => state.isGameOver
);

export const selectBoardSize = createSelector(
  selectSharedState,
  (state: SharedAppState) => state.boardSize
);
