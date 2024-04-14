import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DirectionService} from "./games/snake/services/direction.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'games';

  directionService = inject(DirectionService);

  constructor() {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      this.directionService.next(e);
    });
  }
}
