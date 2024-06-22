import { Position } from '../../shared/models/position';

export class Wall {
  position: Position;

  constructor(initialPosition: Position) {
    this.position = initialPosition;
  }
}
