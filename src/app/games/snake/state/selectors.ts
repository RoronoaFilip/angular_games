import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SnakeGameState } from './SnakeGameState';

export const selectSnakeState = createFeatureSelector<SnakeGameState>('snake');

export const selectDirection = createSelector(
  selectSnakeState,
  (state: SnakeGameState) => state.direction
);

export const selectSnakeSpeed = createSelector(
  selectSnakeState,
  (state: SnakeGameState) => state.snakeSpeed
);

