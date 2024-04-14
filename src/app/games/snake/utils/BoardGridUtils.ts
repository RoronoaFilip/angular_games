import { Position } from "../models/position";
import { Direction } from "../models/direction";

export class BoardGridUtils {
  static equal(position1: Position, position2: Position): boolean {
    return position1.x === position2.x && position1.y === position2.y;
  }

  static getRandomPosition(): Position {
    const width = 21;
    const height = 21;

    return {
      x: Math.floor(Math.random() * width) + 1,
      y: Math.floor(Math.random() * height) + 1,
    };
  }

  static isPositionOutOfBounds(position: Position): boolean {
    return position.x < 1 || position.x > 21 || position.y < 1 || position.y > 21;
  }

  static isSnakeCollision(position: Position, snakeBody: Position[]): boolean {
    return snakeBody.some(segment => {
      return position !== segment && this.equal(position, segment);
    });
  }

  static isDirectionOpposite(direction1: Direction, direction2: Direction): boolean {
    return direction1.x === -direction2.x && direction1.y === -direction2.y;
  }
}
