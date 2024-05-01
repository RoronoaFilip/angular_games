import { Component, inject, OnInit } from '@angular/core';
import { TetrisBoardComponent } from '../board/tetris-board.component';
import { Store } from '@ngrx/store';
import { setBoardSize } from '../../../shared/state/shared-actions';
import { Observable } from 'rxjs';
import { selectIsGameOver } from '../../../shared/state/shared-selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-tetris-game',
  standalone: true,
  imports: [ TetrisBoardComponent, AsyncPipe ],
  templateUrl: './tetris-game.component.html',
  styleUrl: './tetris-game.component.scss',
})
export class TetrisGameComponent implements OnInit {

  store = inject(Store);

  gameOver: Observable<boolean> = this.store.select(selectIsGameOver);

  ngOnInit(): void {
    this.store.dispatch(setBoardSize({ boardSize: { columns: 10, rows: 20 } }));
  }

}
