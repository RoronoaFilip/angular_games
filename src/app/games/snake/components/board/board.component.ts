import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Snake } from "../../models/snake";
import { Food } from "../../models/food";
import { DirectionService } from "../../services/direction.service";
import { BoardGridUtils } from "../../utils/BoardGridUtils";
import { Direction } from "../../models/direction";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements AfterViewInit, OnChanges {
  @Input() isPaused = false;
  @Output() gameOverEmitter = new EventEmitter<boolean>();
  @Output() score = new EventEmitter<number>();

  gameOver = false;

  gameBoard!: HTMLDivElement;
  snake = new Snake();
  food = new Food();

  lastRenderTime = 0;
  snakeSpeed = 5;
  animationFrameId!: number;

  directionService = inject(DirectionService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isPaused']?.currentValue) {
      this.pause();
    } else {
      this.start();
    }
  }

  ngAfterViewInit(): void {
    this.gameBoard = document.querySelector('.game-board')! as HTMLDivElement;
    this.directionService.currentDirection$$.subscribe((direction: Direction | null) => {
      if (!direction) return;

      if (BoardGridUtils.isDirectionOpposite(direction, this.snake.currentDirection)) {
        this.emitGameOver();
        return;
      }

      this.snake.currentDirection = direction;
    });

    this.snake.head$$.subscribe(head => {
      if (!head) return;

      if (BoardGridUtils.isPositionOutOfBounds(head) || BoardGridUtils.isSnakeCollision(head, this.snake.snakeBody)) {
        this.emitGameOver();
        return;
      }

      if (BoardGridUtils.equal(head, this.food.position)) {
       this.eatFood();
      }
    });

    this.start();
  }


  private updateFrame(currentTime: any): void {
    window.cancelAnimationFrame(this.animationFrameId);

    if (this.gameOver) return;

    this.animationFrameId = window.requestAnimationFrame(this.updateFrame.bind(this));
    const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / this.snakeSpeed) return;
    this.lastRenderTime = currentTime;
    this.draw();
  }

  private draw(): void {
    this.gameBoard.innerHTML = '';

    this.snake.draw(this.gameBoard);
    this.gameBoard.appendChild(this.food.draw());
  }

  private start(): void {
    if (this.isPaused) return;
    if (!this.animationFrameId) {
      this.animationFrameId = window.requestAnimationFrame(this.updateFrame.bind(this));
    }
  }

  private pause(): void {
    window.cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = 0;
  }

  private emitGameOver(): void {
    this.gameOver = true;
    this.gameOverEmitter.emit(true);
  }

  private eatFood(): void {
    this.snake.grow();
    this.snakeSpeed += 0.1;
    this.food.position = BoardGridUtils.getRandomPosition();
    this.score.emit(1);
  }
}
