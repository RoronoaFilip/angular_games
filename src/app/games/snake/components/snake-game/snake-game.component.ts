import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SnakeBoardComponent } from '../board/snake-board.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';
import { isGameOver, isPaused } from '../../../shared/state/shared-selectors';
import { MenuComponent } from '../../../shared/components/menu/menu.component';
import { MobileControlsComponent } from '../../../shared/components/mobile-controls/mobile-controls.component';
import { SnakeSettingsComponent } from '../snake-settings/snake-settings.component';

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [ SnakeBoardComponent, NgClass, AsyncPipe, MenuComponent, MobileControlsComponent, SnakeSettingsComponent ],
  templateUrl: './snake-game.component.html',
  styleUrl: './snake-game.component.scss',
})
export class SnakeGameComponent implements OnInit, OnDestroy {
  navigationService = inject(NavigationService);
  store = inject(Store);

  isPaused$!: Observable<boolean>;
  isGameOver$!: Observable<boolean>;

  ngOnInit(): void {
    this.isPaused$ = this.store.select(isPaused);
    this.isGameOver$ = this.store.select(isGameOver);
    this.navigationService.subscribeToKeyClicks();
  }

  ngOnDestroy(): void {
    this.navigationService.keyClickSubscription?.unsubscribe();
  }
}
