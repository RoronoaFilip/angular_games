import { Position } from '../../shared/models/position';

export class Food {
  position: Position;

  constructor(initialPosition: Position) {
    this.position = initialPosition;
  }
}
