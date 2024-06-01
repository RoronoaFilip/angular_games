import { inject, Injectable } from '@angular/core';
import { Piece, PIECES } from '../models/piece';
import { Store } from '@ngrx/store';
import { addPassedPiece, setCurrentPiece, setNextPiece, setPassedPieces } from './actions';
import { selectCurrentPiece, selectPassedPieces } from './selectors';
import { KeyClickService } from '../../shared/services/key-click.service';
import { Subscription } from 'rxjs';
import { Position } from '../../shared/models/position';
import { gameOver, incrementScore } from '../../shared/state/shared-actions';
import { PieceUtils } from '../utils/PieceUtils';


@Injectable({
  providedIn: 'root',
})
export class PiecesService {

  pieceUtils = inject(PieceUtils);
  store = inject(Store);
  keyClickService = inject(KeyClickService);
  keyClickSubscription: Subscription | null = null;

  currentPiece: Piece | null = null;
  passedPieces: Piece[] = [];

  accumulatedCoordinates: { x: number, y: number } = { x: 0, y: 0 };

  constructor() {
    this.store.select(selectCurrentPiece).subscribe(piece => {
      this.currentPiece = piece;
    });
    this.store.select(selectPassedPieces).subscribe(pieces => {
      this.passedPieces = pieces;
    });
  }

  isPartOfAnyPiece(position: Position): boolean {
    return this.pieceUtils.isPartOfPassedPieces(position) || this.pieceUtils.isPartOfCurrentPiece(position);
  }

  getPieceColor(position: Position): string {
    if (this.pieceUtils.isPartOfPassedPieces(position)) {
      return this.passedPieces.find(piece =>
        piece.coordinates.some(coord => coord.x === position.x && coord.y === position.y))?.color || '';
    }

    return this.currentPiece?.color || '';
  }

  subscribeToKeyClicks(): void {
    this.keyClickSubscription = this.keyClickService.keyPress$.subscribe(key => {
      console.log('tetris key', key)
      switch (key) {
        case 'ArrowUp':
          this.rotate();
          break;
        case 'ArrowDown':
          this.moveDown();
          break;
        case 'ArrowLeft':
          this.moveLeft();
          break;
        case 'ArrowRight':
          this.moveRight();
          break;
        case ' ':
          this.snapDown();
          break;
      }
    });
  }

  moveDown(): void {
    if (this.isGameOver()) {
      this.store.dispatch(gameOver());
      return;
    }

    if (this.currentPiece && this.pieceUtils.canMoveDown(this.currentPiece)) {
      this.incrementPosition(0, 1);
    } else if (this.currentPiece) {
      this.switchToNextPiece();
    }

    this.handleRemovalOfRows();
  }

  moveLeft(): void {
    if (this.currentPiece && this.pieceUtils.canMoveLeft(this.currentPiece)) {
      this.incrementPosition(-1, 0);
    }
  }

  moveRight(): void {
    if (this.currentPiece && this.pieceUtils.canMoveRight(this.currentPiece)) {
      this.incrementPosition(1, 0);
    }
  }

  rotate(): void {
    if (!this.currentPiece) {
      return;
    }

    const rotatedPiece = this.pieceUtils.getRotatedPiece(this.currentPiece);
    rotatedPiece.coordinates = rotatedPiece.coordinates.map(position => {
      return { x: position.x + this.accumulatedCoordinates.x, y: position.y + this.accumulatedCoordinates.y };
    });

    if (rotatedPiece.coordinates.some(coord => this.pieceUtils.isOutsideOfBoard(coord)
      || this.pieceUtils.isPartOfPassedPieces(coord))) {
      return;
    }

    this.store.dispatch(setCurrentPiece({ piece: rotatedPiece }));
    console.log('rotate');
  }

  isGameOver(): boolean {
    return (this.currentPiece || false) &&
      !this.pieceUtils.canMoveDown(this.currentPiece) && this.accumulatedCoordinates.y === 0;
  }

  getRandomPiece(): Piece {
    const pieceNames = Object.keys(PIECES);
    const randomPieceName = pieceNames[Math.floor(Math.random() * pieceNames.length)];
    const piece = PIECES[randomPieceName]['UP'];
    return { ...piece };
  }

  private incrementPosition(xIncrement: number, yIncrement: number): void {
    if (!this.currentPiece) {
      return;
    }

    const newPiece: Piece = {
      ...this.currentPiece,
      coordinates: this.currentPiece.coordinates.map(position => {
        return { x: position.x + xIncrement, y: position.y + yIncrement };
      }),
    };

    this.accumulatedCoordinates.x += xIncrement;
    this.accumulatedCoordinates.y += yIncrement;

    this.store.dispatch(setCurrentPiece({ piece: newPiece }));
  }

  private handleRemovalOfRows(): void {
    const rowsToRemove = this.pieceUtils.findRowsToRemove();
    if (!rowsToRemove.length) {
      return;
    }

    let newPassedPieces = this.passedPieces;
    rowsToRemove.forEach(row => {
      newPassedPieces = this.pieceUtils.removeRow(row, newPassedPieces);
    });

    this.store.dispatch(setPassedPieces({ pieces: newPassedPieces }));

    this.store.dispatch(incrementScore({ incrementValue: this.calculateScore(rowsToRemove.length) }));
  }


  private switchToNextPiece(): void {
    this.accumulatedCoordinates = { x: 0, y: 0 };
    this.store.dispatch(addPassedPiece({ piece: this.currentPiece! }));
    this.store.dispatch(setNextPiece({ nextPiece: this.getRandomPiece() }));
  }

  private snapDown(): void {
    while (this.pieceUtils.canMoveDown(this.currentPiece!)) {
      this.moveDown();
    }
  }

  private calculateScore(removedRowsCount: number): number {
    return removedRowsCount === 1 ? 40 : removedRowsCount === 2 ? 100 : removedRowsCount === 3 ? 300 : 1200;
  }
}
