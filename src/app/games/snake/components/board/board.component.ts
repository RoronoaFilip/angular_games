import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Snake } from "../../models/snake";
import { Food } from "../../models/food";
import { DirectionService } from "../../services/direction.service";
import { BoardGridUtils } from "../../utils/BoardGridUtils";
import { Direction } from "../../models/direction";
import { NgClass, NgForOf } from "@angular/common";
import { Position } from "../../models/position";
import { interval, Observable, Subscription, takeUntil } from "rxjs";
import { SettingsService } from "../../services/settings.service";
import { BoardSize } from "../../models/BoardSize";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    NgClass,
    NgForOf
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  BOARD_ROWS = 26;
  BOARD_COLUMNS = 26;

  @Input() isPaused = false;
  @Output() gameOverEmitter = new EventEmitter<boolean>();
  @Output() score = new EventEmitter<number>();

  gameOver = false;

  snake: Snake = new Snake({ x: this.BOARD_ROWS / 2, y: this.BOARD_COLUMNS / 2 });
  food: Food = new Food(BoardGridUtils.getRandomPosition());

  snakeSpeed = 5;

  directionService = inject(DirectionService);
  settingsService = inject(SettingsService);

  ticker$: Observable<number> | null = null;
  stopTicker$ = new EventEmitter<void>();
  private subscription: Subscription | null = null;

  ngOnInit(): void {
    // TODO: Think of a way with settings
    // TODO: Calculate positions correctly
    this.subscribeForSettingsChange(); // must be first
    this.subscribeForDirectionChange();
    this.subscribeForSnakeMove();
  }

  ngAfterViewInit(): void {
    this.start();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isPaused']?.currentValue) {
      this.stop();
    } else {
      this.start();
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }

  isFood(position: Position): boolean {
    return BoardGridUtils.equal(position, this.food.position);
  }

  array(start: number, end: number): number[] {
    return Array.from({ length: end - start }, (_, i) => start + i);
  }

  isSnake(position: Position): boolean {
    return BoardGridUtils.isSnakeCollision(position, this.snake.snakeBody);
  }

  private start(): void {
    if (this.isPaused) return;
    this.subscription?.unsubscribe();

    this.ticker$ = interval(1000 / this.snakeSpeed)
      .pipe(
        takeUntil(this.stopTicker$),
      );

    this.subscription = this.ticker$.subscribe(() => {
      this.snake.move();
    });
  }

  private stop(): void {
    this.subscription?.unsubscribe();
    this.stopTicker$.emit();
  }

  private emitGameOver(): void {
    this.stop();
    this.gameOver = true;
    this.gameOverEmitter.emit(true);
  }

  private eatFood(): void {
    this.snake.grow();
    this.snakeSpeed += 0.1;
    this.food.position = BoardGridUtils.getRandomPosition();
    this.score.emit(1);
  }

  private subscribeForDirectionChange(): void {
    this.directionService.currentDirection$$.subscribe((direction: Direction | null) => {
      if (!direction) return;

      if (BoardGridUtils.isDirectionOpposite(direction, this.snake.currentDirection)) {
        this.emitGameOver();
        return;
      }

      this.snake.currentDirection = direction;
    });
  }

  private subscribeForSnakeMove(): void {
    this.snake.head$$.subscribe(head => {
      if (!head) return;

      if (BoardGridUtils.isPositionOutOfBounds(head) || BoardGridUtils.isSnakeCollision(head, this.snake.snakeBody)) {
        this.emitGameOver();
        return;
      }

      if (BoardGridUtils.equal(head, this.food.position)) {
        this.stop();
        this.eatFood();
        this.snakeSpeed += 0.1;
        this.start();
      }
    });
  }

  private subscribeForSettingsChange(): void {
    this.settingsService.boardSize$$.subscribe((boardSize: BoardSize) => {
      this.BOARD_ROWS = boardSize.rows;
      this.BOARD_COLUMNS = boardSize.columns;

      this.snake = new Snake({ x: this.BOARD_ROWS / 2, y: this.BOARD_COLUMNS / 2 });
      this.food = new Food(BoardGridUtils.getRandomPosition());
    });
    this.settingsService.snakeSpeed$$.subscribe((speed: number) => {
      this.snakeSpeed = speed;
    });
  }
}
