import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SnakeGameState } from './SnakeGameState';

export const selectSnakeState = createFeatureSelector<SnakeGameState>('snake');

export const selectIsPaused = createSelector(
  selectSnakeState,
  (state: SnakeGameState) => state.isPaused
);

export const selectDirection = createSelector(
  selectSnakeState,
  (state: SnakeGameState) => state.direction
);

export const selectBoardSize = createSelector(
  selectSnakeState,
  (state: SnakeGameState) => state.boardSize
);

export const selectSnakeSpeed = createSelector(
  selectSnakeState,
  (state: SnakeGameState) => state.snakeSpeed
);

export const selectIsGameOver = createSelector(
  selectSnakeState,
  (state: SnakeGameState) => state.isGameOver
);

