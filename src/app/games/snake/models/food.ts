import { Position } from "./position";

export class Food {
  position: Position;

  constructor(initialPosition: Position) {
    this.position = initialPosition;
  }
}
