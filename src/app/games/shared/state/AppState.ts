import { SnakeGameState } from '../../snake/state/SnakeGameState';
import { ActionReducerMap } from '@ngrx/store';
import { snakeReducer } from '../../snake/state/reducers';

export interface AppState {
  snake: SnakeGameState;
}

export const reducers: ActionReducerMap<AppState> = {
  snake: snakeReducer,
}
