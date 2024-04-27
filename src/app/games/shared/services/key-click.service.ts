import { inject, Injectable } from '@angular/core';
import { DIRECTIONS } from '../../snake/models/direction';
import { Store } from '@ngrx/store';
import { changeDirection, pause } from '../../snake/state/actions';

@Injectable({
  providedIn: 'root',
})
export class KeyClickService {

  store = inject(Store);

  next(event: KeyboardEvent): void {
    event.preventDefault();


    switch (event.key) {
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
      case 'Escape':
        this.store.dispatch(pause());
        break;
    }
  }
}
