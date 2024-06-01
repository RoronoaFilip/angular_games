import { Routes } from '@angular/router';
import { SnakeGameComponent } from './games/snake/components/snake-game/snake-game.component';
import { TetrisGameComponent } from './games/tetris/components/tetris-game/tetris-game.component';
import { WelcomeComponent } from './main/welcome/welcome.component';
import { PuzzleBoardComponent } from './games/arrange_puzzle/components/puzzle-board/puzzle-board.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: WelcomeComponent,
  },
  {
    path: 'games',
    children: [
      {
        path: 'snake',
        component: SnakeGameComponent,
      },
      {
        path: 'tetris',
        component: TetrisGameComponent,
      },
      {
        path: 'arrange_puzzle',
        component: PuzzleBoardComponent,
      },
    ],
  },
];
