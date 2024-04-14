import { Routes } from '@angular/router';
import { SnakeGameComponent } from "./games/snake/components/snake-game/snake-game.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/snake',
    pathMatch: 'full'
  },
  {
    path: 'snake',
    component: SnakeGameComponent
  }
];
