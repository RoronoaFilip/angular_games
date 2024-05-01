import { Component, OnInit, inject } from '@angular/core';
import { TetrisBoardComponent } from '../board/tetris-board.component';
import { Store } from '@ngrx/store';
import { setBoardSize } from '../../../shared/state/shared-actions';

@Component({
  selector: 'app-tetris-game',
  standalone: true,
  imports: [ TetrisBoardComponent ],
  templateUrl: './tetris-game.component.html',
  styleUrl: './tetris-game.component.scss',
})
export class TetrisGameComponent implements OnInit {

  store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(setBoardSize({ boardSize: { columns: 10, rows: 20 } }));
  }

}
