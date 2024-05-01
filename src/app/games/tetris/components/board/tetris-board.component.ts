import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { PiecesService } from '../state/pieces.service';
import { interval, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { gameOver } from '../../../shared/state/shared-actions';
import { selectIsGameOver } from '../../../shared/state/shared-selectors';

@Component({
  selector: 'app-tetris-board',
  standalone: true,
  imports: [ NgClass, AsyncPipe, NgStyle ],
  templateUrl: './tetris-board.component.html',
  styleUrl: './tetris-board.component.scss',
})
export class TetrisBoardComponent implements OnInit, OnDestroy {
  readonly BOARD_ROWS = 20;
  readonly BOARD_COLUMNS = 10;

  store = inject(Store);

  private intervalSubscription: Subscription | null = null;

  piecesService = inject(PiecesService);

  ngOnInit(): void {
    this.subscribeToStore();
    this.piecesService.subscribeToKeyClicks();
    this.start();
  }

  ngOnDestroy(): void {
    console.log('destroy tetris game')
    this.piecesService.keyClickSubscription?.unsubscribe();
    this.intervalSubscription?.unsubscribe();
  }

  array(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  private start(): void {
    this.intervalSubscription = interval(1000)
      .subscribe(() => {
        console.log('move down')
        this.piecesService.moveDown();
      });
  }

  private emitGameOver(): void {
    this.store.dispatch(gameOver());
    this.intervalSubscription?.unsubscribe();
  }

  private subscribeToStore(): void {
    this.store.select(selectIsGameOver).subscribe(isGameOver => {
      if (isGameOver) {
        this.emitGameOver();
      }
    });
  }
}
