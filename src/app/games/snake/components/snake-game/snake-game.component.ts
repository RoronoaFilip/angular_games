import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SnakeBoardComponent } from '../board/snake-board.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { changeDirection } from '../../state/actions';
import { DIRECTIONS } from '../../models/direction';
import { NavigationService } from '../../services/navigation.service';
import { selectIsGameOver, selectIsPaused } from '../../../shared/state/shared-selectors';
import { MenuComponent } from '../../../shared/components/menu/menu.component';
import { MobileControlsComponent } from '../../../shared/components/mobile-controls/mobile-controls.component';

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [ SnakeBoardComponent, NgClass, AsyncPipe, MenuComponent, MobileControlsComponent ],
  templateUrl: './snake-game.component.html',
  styleUrl: './snake-game.component.scss',
})
export class SnakeGameComponent implements OnInit, OnDestroy {
  navigationService = inject(NavigationService);
  store = inject(Store);

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
}
