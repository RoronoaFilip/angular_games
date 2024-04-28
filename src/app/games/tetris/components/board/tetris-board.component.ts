import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { PiecesService } from '../state/pieces.service';
import { Piece, PIECES } from '../../models/pieces/piece';
import { interval } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentPiece } from '../state/selectors';
import { setCurrentPiece, setNextPiece } from '../state/actions';

@Component({
  selector: 'app-tetris-board',
  standalone: true,
  imports: [ NgClass, AsyncPipe ],
  templateUrl: './tetris-board.component.html',
  styleUrl: './tetris-board.component.scss',
})
export class TetrisBoardComponent implements OnInit, OnDestroy {
  readonly BOARD_ROWS = 20;
  readonly BOARD_COLUMNS = 10;

  store = inject(Store);

  currentPiece: Piece | null = null;

  piecesService = inject(PiecesService);

  ngOnInit(): void {
    this.subscribeToStore();
    this.piecesService.subscribeToKeyClicks();
    this.start();


    this.store.dispatch(setNextPiece({ nextPiece: PIECES['L']['UP'] }));
    this.store.dispatch(setCurrentPiece());
  }

  ngOnDestroy(): void {
    console.log('destroy tetris game')
    this.piecesService.keyClickSubscription?.unsubscribe();
  }

  array(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  private start(): void {
    interval(1000).pipe(

    ).subscribe(() => {
      this.piecesService.moveDown();
    });
  }

  private subscribeToStore(): void {
    this.store.select(selectCurrentPiece).subscribe(piece => {
      this.currentPiece = piece;
    });
  }
}
