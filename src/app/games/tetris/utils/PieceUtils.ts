import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBoardSize } from '../../shared/state/shared-selectors';
import { BoardSize } from '../../shared/models/BoardSize';
import { Piece, PIECES } from '../models/piece';
import { Position } from '../../shared/models/position';
import { selectCurrentPiece, selectPassedPieces } from '../components/state/selectors';

@Injectable({
  providedIn: 'root',
})
export class PieceUtils {
  boardSize: BoardSize = { rows: 20, columns: 10 };

  store = inject(Store);
  currentPiece: Piece | null = null;
  passedPieces: Piece[] = [];

  constructor() {
    this.store.select(selectBoardSize).subscribe((boardSize) => {
      this.boardSize = boardSize;
    });
    this.store.select(selectCurrentPiece).subscribe((currentPiece) => {
      this.currentPiece = currentPiece;
    });
    this.store.select(selectPassedPieces).subscribe((passedPieces) => {
      this.passedPieces = passedPieces;
    });
  }

  getRotatedPiece(piece: Piece): Piece {
    const nextRotation = piece.nextRotation;
    return { ...PIECES[piece.name.toUpperCase()][nextRotation] };
  }

  isOutsideOfBoard(position: Position): boolean {
    const { x, y } = position;
    return x < 1 || x > this.boardSize.columns || y > this.boardSize.rows;
  }


  canMoveDown(piece: Piece): boolean {
    return piece.coordinates.every(position => {
      const newPosition = { x: position.x, y: position.y + 1 };
      return !this.isPartOfPassedPieces(newPosition)
        && !this.isOutsideOfBoard(newPosition);
    });
  }

  canMoveLeft(piece: Piece): boolean {
    return piece.coordinates.every(position => {
      const newPosition = { x: position.x - 1, y: position.y };
      return !this.isOutsideOfBoard(newPosition)
        && !this.isPartOfPassedPieces(newPosition);
    });
  }

  canMoveRight(piece: Piece): boolean {
    return piece.coordinates.every(position => {
      const newPosition = { x: position.x + 1, y: position.y };
      return !this.isOutsideOfBoard(newPosition)
        && !this.isPartOfPassedPieces(newPosition);
    });
  }

  isPartOfCurrentPiece(position: Position): boolean {
    const { x, y } = position;
    return this.currentPiece?.coordinates.some(coord => coord.x === x && coord.y === y)
      || false;
  }

  isPartOfPassedPieces(position: Position): boolean {
    const { x, y } = position;
    return this.passedPieces.some(piece =>
      piece?.coordinates.some(coord => coord.x === x && coord.y === y));
  }

  findRowsToRemove(): number[] {
    const rows = Array.from({ length: this.boardSize.rows }, (_, i) => i + 1);
    const columns = Array.from({ length: this.boardSize.columns }, (_, i) => i + 1);

    return rows.filter(row => {
      return columns.every(column => {
        return this.passedPieces.some(piece =>
          piece.coordinates.some(coord => coord.x === column && coord.y === row));
      });
    });
  }

  removeRow(row: number, pieces: Piece[]): Piece[] {
    return pieces.map(piece => {
      return this.removeRowFromPiece(row, piece);
    });
  }

  private removeRowFromPiece(row: number, piece: Piece) {
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
  }
}
