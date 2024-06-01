import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SnakeGameState } from './SnakeGameState';

export const selectSnakeState = createFeatureSelector<SnakeGameState>('snake');

export const snakeDirection = createSelector(
  selectSnakeState,
  (state: SnakeGameState) => state.direction
);

export const snakeSpeed = createSelector(
  selectSnakeState,
  (state: SnakeGameState) => state.snakeSpeed
);

