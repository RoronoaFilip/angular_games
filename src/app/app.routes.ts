import { Routes } from '@angular/router';
import { SnakeGameComponent } from "./games/snake/components/snake-game/snake-game.component";
import { TetrisGameComponent } from "./games/tetris/components/tetris-game/tetris-game.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tetris',
    pathMatch: 'full'
  },
  {
    path: 'snake',
    component: SnakeGameComponent
  },
  {
    path: 'tetris',
    component: TetrisGameComponent
  }
];
