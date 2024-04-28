import { createAction, props } from '@ngrx/store';
import { BoardSize } from '../models/BoardSize';

export const pause = createAction(
  '[Shared] Pause'
);

export const gameOver = createAction(
  '[Shared] Game Over'
);

export const setBoardSize = createAction(
  '[Shared] Set Board Size',
  props<{ boardSize: BoardSize }>()
);


