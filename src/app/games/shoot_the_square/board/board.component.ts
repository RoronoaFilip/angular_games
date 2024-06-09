import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CanvasUtils } from '../utils/CanvasUtils';
import { GetCoordinatesDirective } from '../directives/get-coordinates.directive';
import { Position } from '../../shared/models/position';
import { BehaviorSubject, interval, Observable, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { SquareService } from '../services/square.service';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { score } from '../../shared/state/shared-selectors';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    GetCoordinatesDirective,
    AsyncPipe,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  ctx!: CanvasRenderingContext2D;

  store = inject(Store);
  score!: Observable<number>;

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
    CanvasUtils.drawCircle(this.ctx, this.ballPosition.x, this.ballPosition.y, 15, 'Fuchsia');
    this.ballSubject.next(this.ballPosition);
  }

  private resetBall() {
    this.isShot = false;
    this.clearBall();
    this.ballPosition = CanvasUtils.getBallPosition(this.canvas.nativeElement);
    this.drawBall();
  }

  private onResize() {
    this.canvas.nativeElement.width = window.innerWidth - 100;
    this.canvas.nativeElement.height = window.innerHeight - 100;

    this.resetBall();
  }

  private subscribeToStore() {
    this.score = this.store.select(score);

    this.score.subscribe((score) => {
      if (score % 50 === 0) {
        this.squareService.increaseDrawSpeed();
      }
    });
  }
}
