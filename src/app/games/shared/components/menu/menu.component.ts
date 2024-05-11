import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsGameOver, selectIsPaused, selectScore } from '../../state/shared-selectors';
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
    this.isPaused$ = this.store.select(selectIsPaused);
    this.isGameOver$ = this.store.select(selectIsGameOver);
    this.store.select(selectScore).subscribe(score => {
      this.score = score;
    });
  }


  restart(): void {
    location.reload();
  }

  pause(): void {
    this.store.dispatch(pause());
  }
}
