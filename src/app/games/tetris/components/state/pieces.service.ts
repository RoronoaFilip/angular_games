import { inject, Injectable } from '@angular/core';
import { Piece, PIECES } from '../../models/piece';
import { Store } from '@ngrx/store';
import { moveCurrentPiece, setCurrentPiece, setNextPiece } from './actions';
import { selectCurrentPiece } from './selectors';
import { KeyClickService } from '../../../shared/services/key-click.service';
import { Subscription } from 'rxjs';
import { selectBoardSize } from '../../../shared/state/shared-selectors';
import { BoardSize } from '../../../shared/models/BoardSize';
import { Position } from '../../../shared/models/position';
import { gameOver } from '../../../shared/state/shared-actions';


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

  isPartOfAnyPiece(position: Position): boolean {
    return this.isPartOfPassedPieces(position) || this.isPartOfCurrentPiece(position);
  }

  getPieceColor(position: Position): string {
    if (this.isPartOfPassedPieces(position)) {
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
      }
    });
  }

  moveDown(): void {
    if (this.isGameOver()) {
      this.store.dispatch(gameOver());
      return;
    }

    if (this.currentPiece && this.canMoveDown(this.currentPiece)) {
      this.incrementPosition(0, 1);
    } else if (this.currentPiece) {
      this.switchToNextPiece();
    }

    this.handleRemovalOfRows();
  }

  moveLeft(): void {
    if (this.currentPiece && this.canMoveLeft(this.currentPiece)) {
      this.incrementPosition(-1, 0);
    }
  }

  moveRight(): void {
    if (this.currentPiece && this.canMoveRight(this.currentPiece)) {
      this.incrementPosition(1, 0);
    }
  }

  rotate(): void {
    if (!this.currentPiece) {
      return;
    }

    const rotatedPiece = this.getRotatedPiece(this.currentPiece);
    rotatedPiece.coordinates = rotatedPiece.coordinates.map(position => {
      return { x: position.x + this.passedCoordinates.x, y: position.y + this.passedCoordinates.y };
    });

    if (rotatedPiece.coordinates.some(coord => this.isOutsideOfBoard(coord) || this.isPartOfPassedPieces(coord))) {
      return;
    }

    this.currentPiece = {
      ...rotatedPiece,
    };
  }

  isGameOver(): boolean {
    return (this.currentPiece || false) && !this.canMoveDown(this.currentPiece) && this.passedCoordinates.y === 0;
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

    const newPiece = {
      ...this.currentPiece,
      coordinates: this.currentPiece.coordinates.map(position => {
        return { x: position.x + xIncrement, y: position.y + yIncrement };
      }),
    };

    this.passedCoordinates.x += xIncrement;
    this.passedCoordinates.y += yIncrement;

    this.store.dispatch(moveCurrentPiece({ piece: newPiece }));
  }

  private canMoveDown(piece: Piece): boolean {
    return piece.coordinates.every(position => {
      const newPosition = { x: position.x, y: position.y + 1 };
      return !this.isPartOfPassedPieces(newPosition)
        && !this.isOutsideOfBoard(newPosition);
    });
  }

  private canMoveLeft(piece: Piece): boolean {
    return piece.coordinates.every(position => {
      const newPosition = { x: position.x - 1, y: position.y };
      return !this.isOutsideOfBoard(newPosition)
        && !this.isPartOfPassedPieces(newPosition);
    });
  }

  private canMoveRight(piece: Piece): boolean {
    return piece.coordinates.every(position => {
      const newPosition = { x: position.x + 1, y: position.y };
      return !this.isOutsideOfBoard(newPosition)
        && !this.isPartOfPassedPieces(newPosition);
    });
  }

  private getRotatedPiece(piece: Piece): Piece {
    const nextRotation = piece.nextRotation;
    return { ...PIECES[piece.name.toUpperCase()][nextRotation] };
  }

  private isPartOfCurrentPiece(position: Position): boolean {
    const { x, y } = position;
    return this.currentPiece?.coordinates.some(coord => coord.x === x && coord.y === y)
      || false;
  }

  private isPartOfPassedPieces(position: Position): boolean {
    const { x, y } = position;
    return this.passedPieces.some(piece =>
      piece?.coordinates.some(coord => coord.x === x && coord.y === y));
  }

  private isOutsideOfBoard(position: Position): boolean {
    const { x, y } = position;
    return x < 1 || x > this.boardSize.columns || y > this.boardSize.rows;
  }

  private findRowsToRemove(): number[] | undefined {
    const rows = Array.from({ length: this.boardSize.rows }, (_, i) => i + 1);
    return rows.filter(row => {
      return Array.from({ length: this.boardSize.columns }, (_, i) => i + 1).every(column => {
        return this.passedPieces.some(piece => piece.coordinates.some(coord => coord.x === column && coord.y === row));
      });
    });
  }

  private handleRemovalOfRows(): void {
    const rowsToRemove = this.findRowsToRemove();
    if (!rowsToRemove) {
      return;
    }

    rowsToRemove.forEach(row => {
      this.passedPieces = this.passedPieces.map(piece => {
        return {
          ...piece,
          coordinates: piece.coordinates
            .filter(coord => coord.y !== row)
            .map(coord => {
              return {
                x: coord.x,
                y: coord.y < row ? coord.y + 1 : coord.y,
              }
            }),
        };
      });
    });
  }

  private switchToNextPiece(): void {
    this.passedPieces.push(this.currentPiece!);
    this.passedCoordinates = { x: 0, y: 0 };
    this.store.dispatch(setCurrentPiece());
    this.store.dispatch(setNextPiece({ nextPiece: this.getRandomPiece() }));
  }
}
