import { Injectable } from '@angular/core';
import { Move } from '../models/move';

@Injectable({
  providedIn: 'root',
})
export class NumbersService {
  numbers: number[][] = [];

  setNumbers(width: number, height: number): void {
    let i = 1;
    this.numbers = Array.from(
      { length: height },
      () => Array.from(
        { length: width },
        () => i++
      )
    );

    this.numbers[height - 1][width - 1] = 0;

    this.shuffleNumbers();
  }

  canMoveLeft(x: number, y: number): boolean {
    return !this.numbers[x][y - 1];
  }

  canMoveRight(x: number, y: number): boolean {
    return !this.numbers[x][y + 1];
  }

  canMoveUp(x: number, y: number): boolean {
    return !this.numbers[x - 1][y];
  }

  canMoveDown(x: number, y: number): boolean {
    return !this.numbers[x + 1][y];
  }

  move(x: number, y: number, move: Move) {
    switch (move) {
      case 'LEFT':
        this.swap(x, y, x, y - 1);
        break;
      case 'RIGHT':
        this.swap(x, y, x, y + 1);
        break;
      case 'UP':
        this.swap(x, y, x - 1, y);
        break;
      case 'DOWN':
        this.swap(x, y, x + 1, y);
        break;
    }
  }

  private swap(x: number, y: number, x1: number, y1: number): void {
    [ this.numbers[x][y], this.numbers[x1][y1] ] = [ this.numbers[x1][y1], this.numbers[x][y] ];
  }


  private shuffleNumbers(): void {
    for (let i = 0; i < this.numbers.length; i++) {
      for (let j = 0; j < this.numbers[i].length; j++) {
        this.numbers[i] = this.numbers[i].sort(() => Math.random() - 0.5);
      }
    }

    this.numbers = this.numbers.sort(() => Math.random() - 0.5);
  }
}
