import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, map, tap } from 'rxjs';
import { pause } from '../state/shared-actions';

@Injectable({
  providedIn: 'root',
})
export class KeyClickService {

  store = inject(Store);

  keyPress$ = fromEvent(document, 'keydown').pipe(
    tap((event: Event) => event.preventDefault()),
    map((event: Event) => (event as KeyboardEvent).key),
    tap((key: string) => {
      if (key === 'Escape') {
        this.store.dispatch(pause());
      }
    })
  );

  dispatchKeyEvent(key: string): void {
    document.dispatchEvent(new KeyboardEvent('keydown', { key }));
  }
}
