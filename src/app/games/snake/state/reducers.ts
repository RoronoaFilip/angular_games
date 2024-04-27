import { changeDirection, gameOver, increaseSnakeSpeed, pause, setBoardSize, setSnakeSpeed } from './actions';
import { ActionReducer, createReducer, on } from '@ngrx/store';
import { SnakeGameState } from './SnakeGameState';

export const initialState: SnakeGameState = {
  isPaused: false,
  isGameOver: false,
  direction: null,
  boardSize: { rows: 26, columns: 26 },
  snakeSpeed: 5,
};

export const snakeReducer: ActionReducer<SnakeGameState> = createReducer(
  initialState,

  on(pause, (state) => {
    return { ...state, isPaused: !state.isPaused && !state.isGameOver };
  }),

  on(gameOver, (state) => {
    return { ...state, isGameOver: true };
  }),

  on(changeDirection, (state: SnakeGameState, { direction }) => {
    if (!direction) return state;
    return { ...state, direction };
  }),

  on(setBoardSize, (state: SnakeGameState, { boardSize }) => {
    return { ...state, boardSize };
  }),

  on(increaseSnakeSpeed, (state: SnakeGameState) => {
    return { ...state, snakeSpeed: state.snakeSpeed + 0.2 };
  }),

  on(setSnakeSpeed, (state: SnakeGameState, { snakeSpeed }) => {
    return { ...state, snakeSpeed };
  })
);
