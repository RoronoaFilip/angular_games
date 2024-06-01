import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { isGameOver, isPaused, score } from '../../state/shared-selectors';
import { pause } from '../../state/shared-actions';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    AsyncPipe,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {

  store = inject(Store);
  isPaused$!: Observable<boolean>;
  isGameOver$!: Observable<boolean>;

  score = 0;

  ngOnInit(): void {
    this.isPaused$ = this.store.select(isPaused);
    this.isGameOver$ = this.store.select(isGameOver);
    this.store.select(score).subscribe(score => {
      this.score = score;
    });
  }


  restart(): void {
    location.reload();
  }

  backToMenu(): void {
    location.href = '/';
  }

  pause(): void {
    this.store.dispatch(pause());
  }
}
