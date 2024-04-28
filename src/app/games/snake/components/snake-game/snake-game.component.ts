import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SnakeBoardComponent } from '../board/snake-board.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { changeDirection } from '../../state/actions';
import { DIRECTIONS } from '../../models/direction';
import { NavigationService } from '../../services/navigation.service';
import { selectIsGameOver, selectIsPaused } from '../../../shared/state/shared-selectors';
import { pause } from '../../../shared/state/shared-actions';

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [ SnakeBoardComponent, NgClass, AsyncPipe ],
  templateUrl: './snake-game.component.html',
  styleUrl: './snake-game.component.scss',
})
export class SnakeGameComponent implements OnInit, OnDestroy {
  navigationService = inject(NavigationService);
  store = inject(Store);

  score = 0;

  isPaused$!: Observable<boolean>;
  isGameOver$!: Observable<boolean>;

  ngOnInit(): void {
    this.isPaused$ = this.store.select(selectIsPaused);
    this.isGameOver$ = this.store.select(selectIsGameOver);
    this.navigationService.subscribeToKeyClicks();
  }

  ngOnDestroy(): void {
    console.log('destroy snake game')
    this.navigationService.keyClickSubscription?.unsubscribe();
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
