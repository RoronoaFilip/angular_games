import { Injectable } from '@angular/core';
import { Direction, DIRECTIONS } from "../../snake/models/direction";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class KeyClickService {

  currentDirection$$ = new BehaviorSubject<Direction | null>(null);
  keyPress$$ = new BehaviorSubject<string | null>(null);

  next(event: KeyboardEvent): void {
    event.preventDefault();

    this.keyPress$$.next(event.key);

    switch (event.key) {
      case 'ArrowUp':
        this.currentDirection$$.next(DIRECTIONS.UP);
        break;
      case 'ArrowDown':
        this.currentDirection$$.next(DIRECTIONS.DOWN);
        break;
      case 'ArrowLeft':
        this.currentDirection$$.next(DIRECTIONS.LEFT);
        break;
      case 'ArrowRight':
        this.currentDirection$$.next(DIRECTIONS.RIGHT);
        break;
    }
  }
}
