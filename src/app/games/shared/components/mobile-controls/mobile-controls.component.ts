import { Component, inject } from '@angular/core';
import { KeyClickService } from '../../services/key-click.service';

@Component({
  selector: 'app-mobile-controls',
  standalone: true,
  imports: [],
  templateUrl: './mobile-controls.component.html',
  styleUrl: './mobile-controls.component.scss',
})
export class MobileControlsComponent {

  keyClickService = inject(KeyClickService);

  dispatchKeyEvent(key: string): void {
    this.keyClickService.dispatchKeyEvent(key);
  }
}
