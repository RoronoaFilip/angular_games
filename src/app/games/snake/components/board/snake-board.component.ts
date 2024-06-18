import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Snake } from '../../models/snake';
import { Food } from '../../models/food';
import { BoardGridUtils } from '../../utils/BoardGridUtils';
import { AsyncPipe, NgClass, NgForOf } from '@angular/common';
import { Position } from '../../../shared/models/position';
import { combineLatest, interval, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { increaseSnakeSpeed } from '../../state/actions';
import { snakeDirection, snakeSpeed } from '../../state/selectors';
import { BoardSize } from '../../../shared/models/BoardSize';
import { Direction } from '../../models/direction';
import { boardSize, isGameOver, isPaused } from '../../../shared/state/shared-selectors';
import { gameOver, incrementScore } from '../../../shared/state/shared-actions';

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

  snake!: Snake;
  food!: Food;

  ticker$: Observable<number> | null = null;
  private intervalSubscription: Subscription | null = null;
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscribeToStore();
    this.subscribeForSnakeMove();
  }

  ngOnDestroy(): void {
    this.stop();

    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
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
    this.intervalSubscription?.unsubscribe();

    this.ticker$ = interval(1000 / this.snakeSpeed);

    return this.ticker$.subscribe(() => {

      this.snake.move();
    });
  }

  private start(): void {
    this.intervalSubscription?.unsubscribe();
    this.intervalSubscription = this.initInterval();
  }

  private stop(): void {
    this.intervalSubscription?.unsubscribe();
  }

  private emitGameOver(): void {
    this.stop();
    this.store.dispatch(gameOver());
  }

  private eatFood(): void {
    this.snake.grow();
    this.store.dispatch(increaseSnakeSpeed());
    this.food.position = this.boardGameUtils.getRandomPosition();
    this.store.dispatch(incrementScore({ incrementValue: 1 }));
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
    this.subscriptions.push(
      this.store.select(boardSize).subscribe((boardSize: BoardSize) => {
        this.BOARD_ROWS = boardSize.rows;
        this.BOARD_COLUMNS = boardSize.columns;

        this.snake = new Snake({ x: this.BOARD_ROWS / 2, y: this.BOARD_COLUMNS / 2 });
        this.food = new Food(this.boardGameUtils.getRandomPosition());
      })
    );

    this.subscriptions.push(
      this.store.select(snakeDirection).subscribe((direction: Direction | null) => {
        direction = direction || this.snake.currentDirection;
        this.snake.currentDirection = direction;
      })
    );

    this.isPaused$ = this.store.select(isPaused);
    this.isGameOver$ = this.store.select(isGameOver);
    this.snakeSpeed$ = this.store.select(snakeSpeed);

    this.subscriptions.push(
      combineLatest([ this.snakeSpeed$, this.isPaused$ ]).subscribe(([ speed, isPaused ]) => {
        this.snakeSpeed = speed;

        if (isPaused) {
          this.stop();
        } else {
          this.start();
        }
      })
    );
  }
}
