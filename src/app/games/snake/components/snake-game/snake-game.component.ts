import { Component, inject, OnInit } from '@angular/core';
import { SnakeBoardComponent } from '../board/snake-board.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectIsGameOver, selectIsPaused } from '../../state/selectors';
import { Observable } from 'rxjs';
import { changeDirection, pause } from '../../state/actions';
import { DIRECTIONS } from '../../models/direction';

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [ SnakeBoardComponent, NgClass, AsyncPipe ],
  templateUrl: './snake-game.component.html',
  styleUrl: './snake-game.component.scss',
})
export class SnakeGameComponent implements OnInit {
  store = inject(Store);

  score = 0;

  isPaused$!: Observable<boolean>;
  isGameOver$!: Observable<boolean>;

  ngOnInit() {
    this.isPaused$ = this.store.select(selectIsPaused);
    this.isGameOver$ = this.store.select(selectIsGameOver);
  }

  onScore(event: number): void {
    this.score += event;
  }

  restart(): void {
    location.reload();
  }

  pause(): void {
    this.store.dispatch(pause());
  }

  dispatchKeyEvent(direction: string): void {
    const dispatchDirection = {
      direction: DIRECTIONS[(direction).toUpperCase()] || null,
    }

    this.store.dispatch(changeDirection(dispatchDirection));
  }
}
