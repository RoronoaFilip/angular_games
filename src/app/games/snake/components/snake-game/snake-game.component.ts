import { Component, inject, OnInit } from '@angular/core';
import { BoardComponent } from "../board/board.component";
import { NgClass } from "@angular/common";
import { DirectionService } from '../../services/direction.service';

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [ BoardComponent, NgClass ],
  templateUrl: './snake-game.component.html',
  styleUrl: './snake-game.component.scss'
})
export class SnakeGameComponent implements OnInit {

  gameOver = false;
  isPaused = false;
  score = 0;

  directionService = inject(DirectionService);

  ngOnInit() {
    this.directionService.lastKey$$.subscribe((key: string | null) => {
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
}
