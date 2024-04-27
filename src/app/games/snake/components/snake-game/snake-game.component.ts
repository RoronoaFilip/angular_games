import { Component, inject, OnInit } from '@angular/core';
import { SnakeBoardComponent } from '../board/snake-board.component';
import { NgClass } from '@angular/common';
import { KeyClickService } from '../../../shared/services/key-click.service';

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [ SnakeBoardComponent, NgClass ],
  templateUrl: './snake-game.component.html',
  styleUrl: './snake-game.component.scss',
})
export class SnakeGameComponent implements OnInit {

  gameOver = false;
  isPaused = false;
  score = 0;

  directionService = inject(KeyClickService);

  ngOnInit() {
    this.subscribeForKeyPress();
  }

  private subscribeForKeyPress() {
    this.directionService.keyPress$$.subscribe((key: string | null) => {
      if (key === 'Escape' && !this.gameOver) {
        this.pause();
      }
    });
  }

  onGameOver(event: boolean): void {
    this.gameOver = event;
  }

  onScore(event: number): void {
    this.score += event;
  }

  pause(): void {
    this.isPaused = !this.isPaused;
  }

  restart(): void {
    location.reload();
  }

  dispatchKeyEvent(key: string): void {
    this.directionService.next(new KeyboardEvent('keydown', { key }));
  }
}
