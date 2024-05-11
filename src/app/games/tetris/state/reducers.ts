import { TetrisGameState } from './TetrisGameState';
import { ActionReducer, createReducer, on } from '@ngrx/store';
import { addPassedPiece, setCurrentPiece, setNextPiece, setPassedPieces } from './actions';

export const initialState: TetrisGameState = {
  currentPiece: null,
  nextPiece: null,
  passedPieces: [],
};

export const tetrisReducer: ActionReducer<TetrisGameState> = createReducer(
  initialState,

  on(setCurrentPiece, (state: TetrisGameState, { piece }) => {
    return { ...state, currentPiece: piece };
  }),

  on(setNextPiece, (state: TetrisGameState, { nextPiece }) => {
    return { ...state, currentPiece: state.nextPiece, nextPiece };
  }),

  on(addPassedPiece, (state: TetrisGameState, { piece }) => {
    return { ...state, passedPieces: [ ...state.passedPieces, piece ] };
  }),

  on(setPassedPieces, (state: TetrisGameState, { pieces }) => {
    return { ...state, passedPieces: pieces };
  })
);
