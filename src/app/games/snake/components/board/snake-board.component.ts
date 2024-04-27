import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Snake } from '../../models/snake';
import { Food } from '../../models/food';
import { BoardGridUtils } from '../../utils/BoardGridUtils';
import { AsyncPipe, NgClass, NgForOf } from '@angular/common';
import { Position } from '../../models/position';
import { combineLatest, interval, map, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { gameOver, increaseSnakeSpeed } from '../../state/actions';
import {
  selectBoardSize,
  selectDirection,
  selectIsGameOver,
  selectIsPaused,
  selectSnakeSpeed,
} from '../../state/selectors';
import { BoardSize } from '../../models/BoardSize';
import { Direction } from '../../models/direction';

@Component({
  selector: 'app-snake-board',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    AsyncPipe,
  ],
  templateUrl: './snake-board.component.html',
  styleUrl: './snake-board.component.scss',
})
export class SnakeBoardComponent implements OnInit, OnDestroy {
  store = inject(Store);
  boardGameUtils = inject(BoardGridUtils);

  isPaused$!: Observable<boolean>;
  isGameOver$!: Observable<boolean>;
  snakeSpeed$!: Observable<number>;
  snakeSpeed = 1;

  BOARD_ROWS = 26;
  BOARD_COLUMNS = 26;

  @Output() score = new EventEmitter<number>();

  snake!: Snake;
  food!: Food;

  ticker$: Observable<number> | null = null;
  private subscription: Subscription | null = null;

  ngOnInit(): void {
    this.subscribeToStore(); // must be first
    this.subscribeForSnakeMove();
  }

  ngOnDestroy(): void {
    this.stop();

    this.store.dispatch(gameOver());
  }

  isFood(position: Position): boolean {
    return this.boardGameUtils.equal(position, this.food.position);
  }

  array(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  isSnake(position: Position): boolean {
    return this.boardGameUtils.isSnakeCollision(position, this.snake.snakeBody);
  }

  private initInterval(): Subscription {
    this.subscription?.unsubscribe();

    this.ticker$ = interval(1000 / this.snakeSpeed).pipe(
      map(() => 1000 / this.snakeSpeed)
    );

    return this.ticker$.subscribe(() => {
      console.log('move');
      this.snake.move();
    });
  }

  private start(): void {
    this.subscription?.unsubscribe();
    this.subscription = this.initInterval();
  }

  private stop(): void {
    this.subscription?.unsubscribe();
  }

  private emitGameOver(): void {
    this.stop();
    this.store.dispatch(gameOver());
  }

  private eatFood(): void {
    this.snake.grow();
    this.store.dispatch(increaseSnakeSpeed());
    this.food.position = this.boardGameUtils.getRandomPosition();
    this.score.emit(1);
  }

  private subscribeForSnakeMove(): void {
    this.snake.head$$.subscribe(head => {
      if (!head) return;

      if (this.boardGameUtils.isPositionOutOfBounds(head)
        || this.boardGameUtils.isSnakeCollision(head, this.snake.snakeBody)) {
        this.emitGameOver();
        return;
      }

      if (this.boardGameUtils.equal(head, this.food.position)) {
        this.eatFood();
      }
    });
  }

  private subscribeToStore(): void {
    this.store.select(selectBoardSize).subscribe((boardSize: BoardSize) => {
      this.BOARD_ROWS = boardSize.rows;
      this.BOARD_COLUMNS = boardSize.columns;

      this.snake = new Snake({ x: this.BOARD_ROWS / 2, y: this.BOARD_COLUMNS / 2 });
      this.food = new Food(this.boardGameUtils.getRandomPosition());
    });

    this.store.select(selectDirection).subscribe((direction: Direction | null) => {
      direction = direction || this.snake.currentDirection;
      this.snake.currentDirection = direction;
    });

    this.isPaused$ = this.store.select(selectIsPaused);
    this.isGameOver$ = this.store.select(selectIsGameOver);
    this.snakeSpeed$ = this.store.select(selectSnakeSpeed);

    combineLatest([ this.snakeSpeed$, this.isPaused$ ]).subscribe(([ speed, isPaused ]) => {
      this.snakeSpeed = speed;

      if (isPaused) {
        this.stop();
      } else {
        this.start();
      }
    });
  }
}
