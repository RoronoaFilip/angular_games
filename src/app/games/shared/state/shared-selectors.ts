import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SharedAppState } from './SharedAppState';

const selectSharedState = createFeatureSelector<SharedAppState>('shared');

export const isPaused = createSelector(
  selectSharedState,
  (state: SharedAppState) => state.isPaused
);

export const isGameOver = createSelector(
  selectSharedState,
  (state: SharedAppState) => state.isGameOver
);

export const score = createSelector(
  selectSharedState,
  (state: SharedAppState) => state.score
);

export const boardSize = createSelector(
  selectSharedState,
  (state: SharedAppState) => state.boardSize
);
