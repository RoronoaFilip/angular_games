import { inject, Injectable } from '@angular/core';
import { Piece, PIECES } from '../../models/pieces/piece';
import { Store } from '@ngrx/store';
import { moveCurrentPiece, setCurrentPiece, setNextPiece } from './actions';
import { selectCurrentPiece } from './selectors';
import { KeyClickService } from '../../../shared/services/key-click.service';
import { Subscription } from 'rxjs';
import { selectBoardSize } from '../../../shared/state/shared-selectors';
import { BoardSize } from '../../../shared/models/BoardSize';
import { Position } from '../../../shared/models/position';


@Injectable({
  providedIn: 'root',
})
export class PiecesService {
  boardSize: BoardSize = { columns: 10, rows: 20 };

  store = inject(Store);
  keyClickService = inject(KeyClickService);
  keyClickSubscription: Subscription | null = null;

  currentPiece: Piece | null = null;
  passedPieces: Piece[] = [];

  passedCoordinates: { x: number, y: number } = { x: 0, y: 0 };

  constructor() {
    this.store.select(selectCurrentPiece).subscribe(piece => {
      this.currentPiece = piece;
    });

    this.store.select(selectBoardSize).subscribe(size => {
      this.boardSize = size;
    });
  }

  shouldStop(piece: Piece): boolean {
    return piece.coordinates.some(position => {
      return this.isOutsideOfBoard(position) || this.isPartOfPassedPieces({ x: position.x, y: position.y + 1 });
    });
  }

  getRandomPiece(): Piece {
    const pieceNames = Object.keys(PIECES);
    const randomPieceName = pieceNames[Math.floor(Math.random() * pieceNames.length)];
    const piece = PIECES[randomPieceName]['UP'];
    return { ...piece };
  }

  // TODO: Fix these Methods that check positions
  isPartOfPassedPieces(position: Position): boolean {
    const { x, y } = position;
    return this.passedPieces.some(piece =>
      piece?.coordinates.some(coord => coord.x === x && coord.y === y));
  }

  isPartOfCurrentPiece(position: Position): boolean {
    const { x, y } = position;
    return this.currentPiece?.coordinates.some(coord => coord.x === x && coord.y === y)
      || false;
  }

  isPartOfAnyPiece(position: Position): boolean {
    return this.isPartOfPassedPieces(position) || this.isPartOfCurrentPiece(position);
  }

  isOutsideOfBoard(position: Position): boolean {
    const { x, y } = position;
    return x < 0 || x >= this.boardSize.columns || y >= this.boardSize.rows;
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
      }
    });
  }

  moveDown(): void {
    this.incrementPosition(0, 1);
  }

  moveLeft(): void {
    this.incrementPosition(-1, 0);
  }

  moveRight(): void {
    this.incrementPosition(1, 0);
  }

  rotate(): void {
    if (!this.currentPiece) {
      return;
    }

    const rotatedPiece = this.getRotatedPiece(this.currentPiece);

    this.currentPiece = {
      ...rotatedPiece,
      coordinates: rotatedPiece.coordinates.map(position => {
        return { x: position.x + this.passedCoordinates.x, y: position.y + this.passedCoordinates.y };
      }),
    };
  }

  private incrementPosition(xIncrement: number, yIncrement: number): void {
    if (!this.currentPiece) {
      return;
    }

    const newPiece = {
      ...this.currentPiece,
      coordinates: this.currentPiece.coordinates.map(position => {
        return { x: position.x + xIncrement, y: position.y + yIncrement };
      }),
    };

    this.passedCoordinates.x += xIncrement;
    this.passedCoordinates.y += yIncrement;

    if (this.canMove(newPiece)) {
      this.store.dispatch(moveCurrentPiece({ piece: newPiece }));
    }

    if (this.shouldStop(this.currentPiece)) {
      this.passedPieces.push(this.currentPiece);
      this.passedCoordinates = { x: 0, y: 0 };
      this.store.dispatch(setCurrentPiece());
      this.store.dispatch(setNextPiece({ nextPiece: this.getRandomPiece() }));
    }
  }

  private canMove(piece: Piece): boolean {
    return piece.coordinates.some(position => {
      return !this.isOutsideOfBoard(position) && !this.isPartOfPassedPieces(position);
    });
  }

  private getRotatedPiece(piece: Piece): Piece {
    const nextRotation = piece.nextRotation;
    return PIECES[piece.name][nextRotation];
  }
}
