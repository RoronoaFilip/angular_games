import { Injectable } from '@angular/core';
import { Direction, DIRECTIONS } from "../models/direction";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DirectionService {

  currentDirection$$ = new BehaviorSubject<Direction | null>(null);
  lastKey$$ = new BehaviorSubject<string | null>(null);

  next(event: KeyboardEvent): void {
    event.preventDefault();

    this.lastKey$$.next(event.key);

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
