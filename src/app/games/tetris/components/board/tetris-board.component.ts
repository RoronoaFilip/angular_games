import { Component, inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { CurrentPieceService } from '../state/current-piece-service';
import { Piece } from '../../models/pieces/piece';
import { interval } from 'rxjs';

@Component({
    selector: 'app-tetris-board',
    standalone: true,
    imports: [ NgClass ],
    templateUrl: './tetris-board.component.html',
    styleUrl: './tetris-board.component.scss',
})
export class TetrisBoardComponent implements OnInit {
    readonly BOARD_ROWS = 20;
    readonly BOARD_COLUMNS = 10;

    currentPiece: Piece | null = null;

    currentPieceService = inject(CurrentPieceService);

    ngOnInit(): void {
        this.currentPieceService.currentPiece$$.subscribe(piece => {
            this.currentPiece = piece;
        });
        // this.start();
    }

    isPartOfCurrentPiece(row: number, column: number): boolean {
        if (!this.currentPiece) {
            return false;
        }
        return this.currentPiece.some(position => position.x === column && position.y === row);
    }

    array(start: number, end: number): number[] {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    private start() {
        interval(1000).subscribe(() => {
            this.currentPieceService.move();
        });
    }
}
