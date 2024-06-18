import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { KeyClickService } from '../../shared/services/key-click.service';
import { DIRECTIONS } from '../models/direction';
import { changeDirection } from '../state/actions';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  store = inject(Store);
  keyClickService = inject(KeyClickService);

  keyClickSubscription: Subscription | null = null;

  subscribeToKeyClicks(): void {
    this.unsubscribeFromKeyClicks();

    this.keyClickSubscription = this.keyClickService.keyPress$.subscribe(key => {
      switch (key) {
        case 'ArrowUp':
          this.store.dispatch(changeDirection({ direction: DIRECTIONS['UP'] }));
          break;
        case 'ArrowDown':
          this.store.dispatch(changeDirection({ direction: DIRECTIONS['DOWN'] }));
          break;
        case 'ArrowLeft':
          this.store.dispatch(changeDirection({ direction: DIRECTIONS['LEFT'] }));
          break;
        case 'ArrowRight':
          this.store.dispatch(changeDirection({ direction: DIRECTIONS['RIGHT'] }));
          break;
      }
    });
  }

  unsubscribeFromKeyClicks(): void {
    this.keyClickSubscription?.unsubscribe();
  }
}
