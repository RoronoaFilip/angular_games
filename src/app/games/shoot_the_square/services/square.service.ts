import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject, Subscription } from 'rxjs';
import { Position } from '../../shared/models/position';
import { CanvasUtils } from '../utils/CanvasUtils';
import { Store } from '@ngrx/store';
import { incrementScore } from '../../shared/state/shared-actions';


@Injectable({
  providedIn: 'root',
})
export class SquareService {
  store = inject(Store);

  ballPosition: Position = { x: 0, y: 0 };
  squares: Position[] = [];
  squaresDrawSpeed = 1500;
  squaresFallSpeed = 1;

  ballPositionSubscription!: Subscription;
  squareIntervalSubscription: Subscription | undefined = undefined;

  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;

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
          ballResetSubject.next();
          CanvasUtils.clearRect(this.ctx, square.x - 2, square.y - 2);

          this.store.dispatch(incrementScore({ incrementValue: 10 }))
        }

        return !isCollision;
      });
    });

    this.initSquaresDrawInterval();
    return ballResetSubject;
  }

  moveSquares() {
    this.squares = this.squares.map((square) => {
      square.y += this.squaresFallSpeed;
      return square;
    });

    this.squares = this.squares.filter((square) => !CanvasUtils.isOutsideCanvas(this.canvas, square.x, square.y));
    console.log(`Squares: ${this.squares.length}`)
  }

  drawSquares() {
    this.squares.forEach((square) => {
      CanvasUtils.clearRect(this.ctx, square.x - 2, square.y - 2);
      CanvasUtils.drawSquare(this.ctx, square.x, square.y);
    });
  }

  unsubscribe() {
    this.ballPositionSubscription?.unsubscribe();
    this.squareIntervalSubscription?.unsubscribe();
  }

  increaseDrawSpeed() {
    this.squaresDrawSpeed = Math.max(100, this.squaresDrawSpeed - 50);
    this.initSquaresDrawInterval();
  }

  private addSquare() {
    const squarePosition = CanvasUtils.getSquarePosition(this.canvas);
    this.squares.push(squarePosition);
  }

  private initSquaresDrawInterval() {
    this.squareIntervalSubscription?.unsubscribe();

    this.squareIntervalSubscription = interval(this.squaresDrawSpeed)
      .subscribe(() => {
        this.addSquare();
      });
  }
}
