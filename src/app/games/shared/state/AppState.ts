import { SnakeGameState } from '../../snake/state/SnakeGameState';
import { ActionReducerMap } from '@ngrx/store';
import { snakeReducer } from '../../snake/state/reducers';
import { tetrisReducer } from '../../tetris/state/reducers';
import { TetrisGameState } from '../../tetris/state/TetrisGameState';
import { SharedAppState } from './SharedAppState';
import { sharedReducer } from './shared-reducers';

export interface AppState {
  shared: SharedAppState;
  snake: SnakeGameState;
  tetris: TetrisGameState;
}

export const reducers: ActionReducerMap<AppState> = {
  shared: sharedReducer,
  snake: snakeReducer,
  tetris: tetrisReducer,
}
