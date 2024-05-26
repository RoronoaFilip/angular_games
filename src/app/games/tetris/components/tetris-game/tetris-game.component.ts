import { Component, inject, OnInit } from '@angular/core';
import { TetrisBoardComponent } from '../board/tetris-board.component';
import { Store } from '@ngrx/store';
import { setBoardSize } from '../../../shared/state/shared-actions';
import { AsyncPipe } from '@angular/common';
import { setNextPiece } from '../../state/actions';
import { PiecesService } from '../../state/pieces.service';
import { MenuComponent } from '../../../shared/components/menu/menu.component';
import { MobileControlsComponent } from '../../../shared/components/mobile-controls/mobile-controls.component';

@Component({
  selector: 'app-tetris-game',
  standalone: true,
  imports: [ TetrisBoardComponent, AsyncPipe, MenuComponent, MobileControlsComponent ],
  templateUrl: './tetris-game.component.html',
  styleUrl: './tetris-game.component.scss',
})
export class TetrisGameComponent implements OnInit {

  store = inject(Store);
  piecesService = inject(PiecesService);


  ngOnInit(): void {
    this.store.dispatch(setBoardSize({ boardSize: { columns: 10, rows: 20 } }));
    this.setStartingPiece();
  }

  private setStartingPiece(): void {
    this.store.dispatch(setNextPiece({ nextPiece: this.piecesService.getRandomPiece() }));
    this.store.dispatch(setNextPiece({ nextPiece: this.piecesService.getRandomPiece() }));
  }
}
