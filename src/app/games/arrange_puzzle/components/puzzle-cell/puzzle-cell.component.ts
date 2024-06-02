import { Component, Input } from '@angular/core';
import { CellMoveDirective } from '../../directives/cell-move.directive';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-puzzle-cell',
  standalone: true,
  imports: [
    CellMoveDirective,
    NgClass,
  ],
  templateUrl: './puzzle-cell.component.html',
  styleUrl: './puzzle-cell.component.scss',
})
export class PuzzleCellComponent {

  @Input() num: number | null = null;
  @Input() x!: number;
  @Input() y!: number;
}
