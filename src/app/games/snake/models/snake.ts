import { Position } from './position';
import { BehaviorSubject } from 'rxjs';
import { Direction } from './direction';

export class Snake {
  snakeBody: Position[] = [];
  head!: Position;
  head$$ = new BehaviorSubject(this.head);

  currentDirection: Direction = { x: 0, y: 0 };

  constructor(initialPosition: Position) {
    this.snakeBody = [ initialPosition ];
    this.head = this.snakeBody[0];
  }

  grow(): void {
    this.snakeBody.push({ ...this.snakeBody[this.snakeBody.length - 1] });
  }

  move(): void {
    for (let i = this.snakeBody.length - 2; i >= 0; i--) {
      this.snakeBody[i + 1] = { ...this.snakeBody[i] }
    }

    this.head.x += this.currentDirection.x;
    this.head.y += this.currentDirection.y;

    this.head$$.next(this.head);
  }
}
