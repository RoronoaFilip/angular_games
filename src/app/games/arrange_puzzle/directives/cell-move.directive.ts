import { Directive, HostListener, inject, ViewContainerRef } from '@angular/core';
import { PuzzleCellComponent } from '../components/puzzle-cell/puzzle-cell.component';
import { NumbersService } from '../services/numbers.service';

@Directive({
  selector: '[appCellMove]',
  standalone: true,
})
export class CellMoveDirective {

  appPuzzleCell!: PuzzleCellComponent;
  numbersService = inject(NumbersService);

  constructor(private viewContainerRef: ViewContainerRef) {
    this.appPuzzleCell = this.viewContainerRef.injector.get(PuzzleCellComponent);
  }

  @HostListener('swipeleft') moveLeft(): void {
    console.log('moveLeft');
    const x = this.appPuzzleCell.x;
    const y = this.appPuzzleCell.y;

    if (this.numbersService.canMoveLeft(x, y)) {
      this.numbersService.move(x, y, 'LEFT');
    }
  }

  @HostListener('swiperight') moveRight(): void {
    console.log('moveRight');
    const x = this.appPuzzleCell.x;
    const y = this.appPuzzleCell.y;

    if (this.numbersService.canMoveRight(x, y)) {
      this.numbersService.move(x, y, 'RIGHT');
    }
  }

  @HostListener('swipeup') moveUp(): void {
    console.log('moveUp');
    const x = this.appPuzzleCell.x;
    const y = this.appPuzzleCell.y;

    if (this.numbersService.canMoveUp(x, y)) {
      this.numbersService.move(x, y, 'UP');
    }
  }

  @HostListener('swipedown') moveDown(): void {
    console.log('moveDown');
    const x = this.appPuzzleCell.x;
    const y = this.appPuzzleCell.y;

    if (this.numbersService.canMoveDown(x, y)) {
      this.numbersService.move(x, y, 'DOWN');
    }
  }
}
