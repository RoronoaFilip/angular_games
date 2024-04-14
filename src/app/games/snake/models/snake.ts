import { Position } from "./position";
import { BehaviorSubject } from "rxjs";
import { Direction } from "./direction";

export const SNAKE_SPEED = 7;

export class Snake {
  snakeBody: Position[] = [ { x: 11, y: 11 } ];
  head = this.snakeBody[0];
  head$$ = new BehaviorSubject(this.head);

  currentDirection: Direction = { x: 0, y: 0 };

  draw(gameBoard: HTMLDivElement): void {
    this.move();
    this.snakeBody.forEach(segment => {
      const snakeElement = document.createElement('div');
      snakeElement.style.gridRowStart = segment.y.toString();
      snakeElement.style.gridColumnStart = segment.x.toString();
      snakeElement.classList.add('snake');
      gameBoard.appendChild(snakeElement);
    });
  }

  grow(): void {
    this.snakeBody.push({ ...this.snakeBody[this.snakeBody.length - 1] });
  }

  private move(): void {
    for (let i = this.snakeBody.length - 2; i >= 0; i--) {
      this.snakeBody[i + 1] = { ...this.snakeBody[i] }
    }

    this.head.x += this.currentDirection.x;
    this.head.y += this.currentDirection.y;

    this.head$$.next(this.head);
  }
}
