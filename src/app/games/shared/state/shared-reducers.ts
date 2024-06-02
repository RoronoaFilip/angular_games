import { SharedAppState } from './SharedAppState';
import { gameOver, incrementScore, pause, setBoardSize, win } from './shared-actions';
import { ActionReducer, createReducer, on } from '@ngrx/store';

export const initialState: SharedAppState = {
  boardSize: { rows: 20, columns: 20 },
  isPaused: false,
  isWin: false,
  isGameOver: false,
  score: 0,
};

export const sharedReducer: ActionReducer<SharedAppState> = createReducer(
  initialState,

  on(pause, (state: SharedAppState) => {
    return { ...state, isPaused: state.isGameOver ? false : !state.isPaused };
  }),

  on(gameOver, (state: SharedAppState) => {
    return { ...state, isGameOver: true };
  }),

  on(win, (state: SharedAppState) => {
    return { ...state, isWin: true };
  }),

  on(incrementScore, (state: SharedAppState, { incrementValue }) => {
    return { ...state, score: state.score + incrementValue };
  }),

  on(setBoardSize, (state: SharedAppState, { boardSize }) => {
    return { ...state, boardSize };
  })
);
