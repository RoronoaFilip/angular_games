import { Component } from '@angular/core';
import { TetrisBoardComponent } from '../board/tetris-board.component';

@Component({
  selector: 'app-tetris-game',
  standalone: true,
  imports: [ TetrisBoardComponent ],
  templateUrl: './tetris-game.component.html',
  styleUrl: './tetris-game.component.scss',
})
export class TetrisGameComponent {


}
