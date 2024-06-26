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
import { gameOver, incrementScore, resetScore } from '../../../shared/state/shared-actions';
import { Wall } from '../../models/wall';

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
  snakeMoveSubscription!: Subscription;
  food!: Food;
  walls!: Wall[];

  ticker$: Observable<number> | null = null;
  private intervalSubscription: Subscription | null = null;
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscribeToStore();
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

  isSnake(position: Position): boolean {
    return this.boardGameUtils.isSnakeCollision(position, this.snake.snakeBody);
  }

  isWall(position: Position): boolean {
    return this.walls.some(wall => this.boardGameUtils.equal(position, wall.position));
  }

  array(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  private initInterval(): Subscription {
    this.intervalSubscription?.unsubscribe();

    this.ticker$ = interval(1000 / this.snakeSpeed);

    return this.ticker$.subscribe(() => {
      this.snake.move();
    });
  }

  private start(): void {
    this.intervalSubscription = this.initInterval();
    this.subscribeForSnakeMove();
  }

  private stop(): void {
    this.intervalSubscription?.unsubscribe();
    this.snakeMoveSubscription?.unsubscribe();
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
    this.snakeMoveSubscription?.unsubscribe();
    this.snakeMoveSubscription = this.snake.head$$.subscribe(head => {
      if (!head) return;

      if (this.boardGameUtils.isPositionOutOfBounds(head)
        || this.boardGameUtils.isSnakeCollision(head, this.snake.snakeBody)) {
        this.emitGameOver();
        return;
      }

      if (this.boardGameUtils.equal(head, this.food.position)) {
        this.eatFood();
        this.walls = this.boardGameUtils.generateWalls();
      } else if (this.isWall(head)) {
        this.emitGameOver();
      }
    });
  }

  private subscribeToStore(): void {
    this.subscriptions.push(
      this.store.select(boardSize).subscribe((boardSize: BoardSize) => {
        this.resetSnakeGame(boardSize);
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

  private resetSnakeGame(boardSize: BoardSize): void {
    this.BOARD_ROWS = boardSize.rows;
    this.BOARD_COLUMNS = boardSize.columns;
    this.store.dispatch(resetScore());

    this.snake = new Snake(this.boardGameUtils.getInitialSnakePosition());
    this.food = new Food(this.boardGameUtils.getRandomPosition());
    this.walls = this.boardGameUtils.generateWalls();

    this.snakeSpeed = 1;

    this.start();
  }
}
