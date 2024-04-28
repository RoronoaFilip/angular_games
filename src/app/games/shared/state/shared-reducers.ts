import { SharedAppState } from './SharedAppState';
import { gameOver, pause, setBoardSize } from './shared-actions';
import { ActionReducer, createReducer, on } from '@ngrx/store';

export const initialState: SharedAppState = {
  boardSize: { rows: 20, columns: 20 },
  isPaused: false,
  isGameOver: false,
  lastKeyPressed: '',
};

export const sharedReducer: ActionReducer<SharedAppState> = createReducer(
  initialState,

  on(pause, (state: SharedAppState) => {
    return { ...state, isPaused: state.isGameOver ? false : !state.isPaused };
  }),

  on(gameOver, (state: SharedAppState) => {
    return { ...state, isGameOver: true };
  }),

  on(setBoardSize, (state: SharedAppState, { boardSize }) => {
    return { ...state, boardSize };
  })
);
