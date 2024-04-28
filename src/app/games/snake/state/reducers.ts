import { changeDirection, increaseSnakeSpeed, setSnakeSpeed } from './actions';
import { ActionReducer, createReducer, on } from '@ngrx/store';
import { SnakeGameState } from './SnakeGameState';

export const initialState: SnakeGameState = {
  direction: null,
  snakeSpeed: 5,
};

export const snakeReducer: ActionReducer<SnakeGameState> = createReducer(
  initialState,

  on(changeDirection, (state: SnakeGameState, { direction }) => {
    if (!direction) return state;
    return { ...state, direction };
  }),

  on(increaseSnakeSpeed, (state: SnakeGameState) => {
    return { ...state, snakeSpeed: state.snakeSpeed + 0.2 };
  }),

  on(setSnakeSpeed, (state: SnakeGameState, { snakeSpeed }) => {
    return { ...state, snakeSpeed };
  })
);
