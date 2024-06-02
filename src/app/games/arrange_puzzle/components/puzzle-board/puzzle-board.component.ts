import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { boardSize, isGameWon, score } from '../../../shared/state/shared-selectors';
import { setBoardSize } from '../../../shared/state/shared-actions';
import { PuzzleCellComponent } from '../puzzle-cell/puzzle-cell.component';
import { interval, map, Observable, Subscription, tap } from 'rxjs';
import { NumbersService } from '../../services/numbers.service';
import { CellMoveDirective } from '../../directives/cell-move.directive';

@Component({
  selector: 'app-puzzle-board',
  standalone: true,
  imports: [
    AsyncPipe,
    PuzzleCellComponent,
    CellMoveDirective,
    NgClass,
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

  moves!: Observable<number>;
  timer!: Subscription;
  time!: string;
  isWon: boolean = false;

  isPlaying = false;

  ngOnInit(): void {
    this.subscribeToStore();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());
  }

  start(): void {
    if (this.isPlaying) {
      return;
    }

    this.timer = interval(1000).pipe(
      map((time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      }),
      tap((time) => (this.time = time))
    ).subscribe();
    this.subscriptions.push(this.timer);

    this.isPlaying = true;
    this.isWon = false;

  }

  stop(): void {
    this.isPlaying = false;
    this.isWon = true;
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());
  }

  restart(): void {
    location.reload();
  }

  array(start: number, end: number):
    number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  private subscribeToStore() {
    this.store.dispatch(setBoardSize({ boardSize: { rows: this.BOARD_ROWS, columns: this.BOARD_COLUMNS } }));

    const subscription = this.store.select(boardSize).subscribe((boardSize) => {
      this.numbersService.setNumbers(boardSize.rows, boardSize.columns);
    });

    this.moves = this.store.select(score);

    const isWonSubscription = this.store.select(isGameWon).subscribe((isWon) => {
      if (isWon) {
        this.stop();
      }
    });

    this.subscriptions.push(subscription);
    this.subscriptions.push(isWonSubscription);
  }
}
