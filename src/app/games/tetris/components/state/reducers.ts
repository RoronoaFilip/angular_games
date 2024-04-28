import { TetrisGameState } from './TetrisGameState';
import { ActionReducer, createReducer, on } from '@ngrx/store';
import { moveCurrentPiece, setCurrentPiece, setNextPiece } from './actions';

export const initialState: TetrisGameState = {
  currentPiece: null,
  nextPiece: null,
};

export const tetrisReducer: ActionReducer<TetrisGameState> = createReducer(
  initialState,

  on(moveCurrentPiece, (state: TetrisGameState, { piece }) => {
    return { ...state, currentPiece: { ...piece } };
  }),

  on(setCurrentPiece, (state: TetrisGameState) => {
    return { ...state, currentPiece: state.nextPiece };
  }),

  on(setNextPiece, (state: TetrisGameState, { nextPiece }) => {
    return { ...state, nextPiece };
  })
);
