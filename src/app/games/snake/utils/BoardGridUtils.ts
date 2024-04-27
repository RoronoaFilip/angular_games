import { Position } from '../models/position';
import { Direction } from '../models/direction';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBoardSize } from '../state/selectors';
import { BoardSize } from '../models/BoardSize';

@Injectable({
  providedIn: 'root',
})
export class BoardGridUtils {
  boardSize: BoardSize = { rows: 26, columns: 26 };

  constructor() {
    inject(Store).select(selectBoardSize).subscribe((boardSize) => {
      this.boardSize = boardSize;
    });
  }


  equal(position1: Position, position2: Position): boolean {
    return position1.x === position2.x && position1.y === position2.y;
  }

  getRandomPosition(): Position {
    const width = this.boardSize.columns;
    const height = this.boardSize.rows;

    return {
      x: Math.abs(Math.floor(Math.random() * width) + 1),
      y: Math.abs(Math.floor(Math.random() * height) + 1),
    };
  }

  isPositionOutOfBounds(position: Position): boolean {
    return position.x < 1 || position.x > this.boardSize.columns
      || position.y < 1 || position.y > this.boardSize.rows;
  }

  isSnakeCollision(position: Position, snakeBody: Position[]): boolean {
    return snakeBody.some(segment => {
      return position !== segment && this.equal(position, segment);
    });
  }

  isDirectionOpposite(direction1: Direction, direction2: Direction): boolean {
    return direction1.x === -direction2.x && direction1.y === -direction2.y;
  }
}
