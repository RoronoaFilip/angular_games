import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject, Subscription, takeUntil } from 'rxjs';
import { Position } from '../../shared/models/position';
import { CanvasUtils } from '../utils/CanvasUtils';
import { Store } from '@ngrx/store';
import { gameOver, incrementScore } from '../../shared/state/shared-actions';
import { Square } from '../models/square';
import { FILL_STYLE } from '../models/fill-style';

@Injectable({
  providedIn: 'root',
})
export class SquareService {
  store = inject(Store);

  ballPosition: Position = { x: 0, y: 0 };
  squares: Square[] = [];
  squaresDrawSpeed = 1500;
  squaresFallSpeed = 1;

  ballPositionSubscription!: Subscription;
  squareIntervalSubscription: Subscription | undefined = undefined;

  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;

  pauseSubject = new Subject<void>();

  setCurrentCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  /**
   * Subscribe to ball movement
   * Return a subject that will be used to reset the ball position
   */
  subscribeToBall(ball: BehaviorSubject<Position>): Subject<void> {
    const ballResetSubject = new Subject<void>();

    this.ballPositionSubscription = ball.subscribe((position) => {
      this.ballPosition = position;

      this.squares = this.squares.filter((square) => {
        const isCollision = CanvasUtils.isCollision(this.ballPosition, square);

        if (isCollision) {
          if (square.fillStyle === FILL_STYLE.BAD_SQUARE) {
            this.store.dispatch(gameOver());
          } else if (square.fillStyle === FILL_STYLE.SQUARE) {
            ballResetSubject.next();
            CanvasUtils.clearRect(this.ctx, square.x - 2, square.y - 2);

            this.store.dispatch(incrementScore({ incrementValue: 10 }))
          }
        }

        return !isCollision;
      });
    });

    this.initSquaresDrawInterval();
    return ballResetSubject;
  }

  unsubscribe() {
    this.ballPositionSubscription?.unsubscribe();
    this.squareIntervalSubscription?.unsubscribe();
  }

  moveSquares() {
    this.squares = this.squares.map((square) => {
      square.y += this.squaresFallSpeed;
      return square;
    });

    if (this.areAnySquaresOutsideCanvas()) {
      this.store.dispatch(gameOver());
    } else {
      this.squares = this.squares.filter((square) => !CanvasUtils.isOutsideCanvas(this.canvas, square.x, square.y));
    }
  }

  drawSquares() {
    this.squares.forEach((square) => {
      CanvasUtils.clearRect(this.ctx, square.x - 2, square.y - 2);
      CanvasUtils.drawSquare(this.ctx, square);
    });
  }

  increaseDrawSpeed() {
    this.squaresDrawSpeed = Math.max(500, this.squaresDrawSpeed - 50);
    this.initSquaresDrawInterval();
  }

  pause(isPaused: boolean) {
    if (isPaused) {
      this.pauseSubject.next();
    } else {
      this.initSquaresDrawInterval();
    }
  }

  private addSquare() {
    const squarePosition = CanvasUtils.generateSquare(this.canvas);
    this.squares.push(squarePosition);
  }

  private initSquaresDrawInterval() {
    this.squareIntervalSubscription?.unsubscribe();

    this.squareIntervalSubscription =
      interval(this.squaresDrawSpeed)
        .pipe(
          takeUntil(this.pauseSubject)
        )
        .subscribe(() => {
          this.addSquare();
        });
  }

  private areAnySquaresOutsideCanvas(): boolean {
    return this.squares.some((square) =>
      square.fillStyle === FILL_STYLE.SQUARE && CanvasUtils.isOutsideCanvas(this.canvas, square.x, square.y));
  }
}
