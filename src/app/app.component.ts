import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeyClickService } from './games/shared/services/key-click.service';
import { CurrentPieceService } from './games/tetris/components/state/current-piece-service';
import { PIECES } from './games/tetris/models/pieces/piece';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'games';

  keyClickService = inject(KeyClickService);

  currentPieceService = inject(CurrentPieceService);

  constructor() {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      this.keyClickService.next(e);
    });

    this.currentPieceService.currentPiece$$.next(PIECES.Z.UP)
  }
}
