import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { boardSize } from '../../../shared/state/shared-selectors';
import { setBoardSize } from '../../../shared/state/shared-actions';
import { PuzzleCellComponent } from '../puzzle-cell/puzzle-cell.component';
import { Subscription } from 'rxjs';
import { NumbersService } from '../../services/numbers.service';
import { CellMoveDirective } from '../../directives/cell-move.directive';

@Component({
  selector: 'app-puzzle-board',
  standalone: true,
  imports: [
    AsyncPipe,
    PuzzleCellComponent,
    CellMoveDirective,
  ],
  templateUrl: './puzzle-board.component.html',
  styleUrl: './puzzle-board.component.scss',
})
export class PuzzleBoardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  BOARD_ROWS = 3;
  BOARD_COLUMNS = 3;

  store = inject(Store);
  numbersService = inject(NumbersService);

  ngOnInit(): void {
    this.store.dispatch(setBoardSize({ boardSize: { rows: this.BOARD_ROWS, columns: this.BOARD_COLUMNS } }));

    const subscription = this.store.select(boardSize).subscribe((boardSize) => {
      this.numbersService.setNumbers(boardSize.rows, boardSize.columns);
    });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());
  }

  array(start: number, end: number):
    number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
