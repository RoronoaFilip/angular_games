import { Position } from "./position";
import { BoardGridUtils } from "../utils/BoardGridUtils";

export class Food {
  position: Position;

  constructor() {
    this.position = BoardGridUtils.getRandomPosition();
  }

  draw(): HTMLDivElement {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = `${this.position.y}`;
    foodElement.style.gridColumnStart = `${this.position.x}`
    foodElement.classList.add('food');
    return foodElement;
  }
}
