import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { PiecesService } from '../../state/pieces.service';
import { interval, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { isGameOver, isPaused } from '../../../shared/state/shared-selectors';
import { Piece } from '../../models/piece';
import { nextTetrisPiece } from '../../state/selectors';
import { Position } from '../../../shared/models/position';

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

  isPaused$!: Observable<boolean>;
  gameOver$!: Observable<boolean>;
  nextPiece: Piece | null = null;

  ngOnInit(): void {
    this.subscribeToStore();
    this.piecesService.subscribeToKeyClicks();
  }

  ngOnDestroy(): void {
    this.piecesService.keyClickSubscription?.unsubscribe();
    this.intervalSubscription?.unsubscribe();
  }

  array(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  isPartOfNextPiece(position: Position): boolean {
    return this.nextPiece?.coordinates
        .map(coord => ({ x: coord.x - 3, y: coord.y }))
        .some(coord => coord.x === position.x && coord.y === position.y)
      || false;
  }

  private start(): void {
    this.intervalSubscription?.unsubscribe();
    this.intervalSubscription = this.initInterval();
  }

  private stop(): void {
    this.intervalSubscription?.unsubscribe();
  }

  private initInterval() {
    return interval(700)
      .subscribe(() => {
        this.piecesService.moveDown();
      });
  }

  private emitGameOver(): void {
    this.stop();
    this.intervalSubscription?.unsubscribe();
  }

  private subscribeToStore(): void {
    this.gameOver$ = this.store.select(isGameOver);
    this.isPaused$ = this.store.select(isPaused);

    this.gameOver$.subscribe(isGameOver => {
      if (isGameOver) {
        this.emitGameOver();
      }
    });

    this.isPaused$.subscribe(isPaused => {
      if (isPaused) {
        this.stop();
      } else {
        this.start();
      }
    });

    this.store.select(nextTetrisPiece).subscribe(nextPiece => {
      this.nextPiece = nextPiece;
    });
  }
}
