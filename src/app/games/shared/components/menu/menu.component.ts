import { AfterViewInit, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { isGameOver, isPaused, score } from '../../state/shared-selectors';
import { pause } from '../../state/shared-actions';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit, AfterViewInit {
  @Input() isRow = false;
  @Input() scoreFontSize = '7vmin';

  @ViewChild('scoreElement')
  scoreElement!: ElementRef;

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

  ngAfterViewInit() {
    this.scoreElement.nativeElement.style.fontSize = this.scoreFontSize;
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
