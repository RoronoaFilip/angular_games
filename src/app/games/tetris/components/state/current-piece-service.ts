import { Injectable } from '@angular/core';
import { Piece } from '../../models/pieces/piece';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CurrentPieceService {
  currentPiece$$ = new BehaviorSubject<Piece | null>(null);

  move(): void {
    const currentPiece = this.currentPiece$$.value;
    if (!currentPiece) {
      return;
    }

    const newPiece = currentPiece.map(position => {
      return { x: position.x, y: position.y + 1 };
    });

    this.currentPiece$$.next(newPiece);
  }

}
