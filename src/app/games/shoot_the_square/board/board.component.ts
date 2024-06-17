import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CanvasUtils } from '../utils/CanvasUtils';
import { GetCoordinatesDirective } from '../directives/get-coordinates.directive';
import { Position } from '../../shared/models/position';
import { BehaviorSubject, interval, Observable, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { SquareService } from '../services/square.service';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { isGameOver, score } from '../../shared/state/shared-selectors';
import { FILL_STYLE } from '../models/fill-style';
import { MenuComponent } from '../../shared/components/menu/menu.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    GetCoordinatesDirective,
    AsyncPipe,
    MenuComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  ctx!: CanvasRenderingContext2D;

  store = inject(Store);
  score$!: Observable<number>;
  isGameOver$!: Observable<boolean>;

  subscriptions: Subscription[] = [];

  squareService = inject(SquareService);

  private ballPosition!: Position;
  private ballSpeed: { x: number, y: number } = { x: 0, y: 0 };
  private ballSubject: BehaviorSubject<Position> = new BehaviorSubject<Position>({ x: 0, y: 0 });

  private stopSubject = new Subject<void>();
  private isShot = false;

  ngOnInit() {
    this.subscribeToStore();

    this.ctx = this.canvas.nativeElement.getContext('2d');
    window.addEventListener('resize', this.onResize.bind(this));

    this.squareService.setCurrentCanvas(this.canvas.nativeElement, this.ctx);
    const subscription = this.squareService.subscribeToBall(this.ballSubject).subscribe(() => {
      this.resetBall();
    });
    this.subscriptions.push(subscription);

    this.start();
  }

  ngAfterViewInit() {
    this.onResize();
  }

  ngOnDestroy() {
    this.stopSubject.next();
    this.stopSubject.complete();
    window.removeEventListener('resize', this.onResize.bind(this));
    this.squareService.unsubscribe();
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());
  }

  moveBall(event: MouseEvent) {
    if (this.isShot) {
      return;
    }

    const clickPosition = {
      x: event.offsetX,
      y: event.offsetY,
    }

    this.ballSpeed = CanvasUtils.calculateSpeed(this.ballPosition, clickPosition);
    this.isShot = true;
  }

  restartGame() {
    location.reload();
  }

  private start(): void {
    this.ballPosition = CanvasUtils.getBallPosition(this.canvas.nativeElement);
    this.drawBall();

    interval(10).pipe(
      takeUntil(this.stopSubject),
      tap(() => {
        this.squareService.moveSquares();
        this.squareService.drawSquares();
      }),
      tap(() => {
        console.log('isShot', this.isShot)
        if (this.isShot) {
          this.incrementBallPosition();
        }
      }),
      tap(() => {
        if (CanvasUtils.isOutsideCanvas(this.canvas.nativeElement, this.ballPosition.x, this.ballPosition.y)) {
          this.resetBall();
        }
      }))
      .subscribe();
  }

  private incrementBallPosition(): void {
    this.clearBall();
    this.ballPosition.x += this.ballSpeed.x;
    this.ballPosition.y += this.ballSpeed.y;
    this.drawBall();
  }

  private clearBall() {
    CanvasUtils.clearCircle(this.ctx, this.ballPosition.x, this.ballPosition.y, 15);
  }

  private drawBall() {
    CanvasUtils.drawCircle(this.ctx, this.ballPosition.x, this.ballPosition.y, 15, FILL_STYLE.BALL);
    this.ballSubject.next(this.ballPosition);
  }

  private resetBall() {
    this.isShot = false;
    this.clearBall();
    this.ballPosition = CanvasUtils.getBallPosition(this.canvas.nativeElement);
    this.drawBall();
  }

  private onResize() {
    this.canvas.nativeElement.width = window.innerWidth - 50;
    this.canvas.nativeElement.height = window.innerHeight - 75;

    this.resetBall();
  }

  private subscribeToStore() {
    this.score$ = this.store.select(score);

    const scoreSubscription = this.score$.subscribe((score) => {
      if (score % 50 === 0) {
        this.squareService.increaseDrawSpeed();
      }
    });

    this.isGameOver$ = this.store.select(isGameOver);
    const gameOverSubscription = this.isGameOver$.subscribe((isGameOver) => {
      if (isGameOver) {
        this.stopSubject.next();
        this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        this.ctx.font = '48px serif';
        this.ctx.fillStyle = FILL_STYLE.BAD_SQUARE;
        this.ctx.fillText('Game Over', this.canvas.nativeElement.width / 2 - 100, this.canvas.nativeElement.height / 2);
      }
    });


    this.subscriptions.push(scoreSubscription, gameOverSubscription);
  }
}
