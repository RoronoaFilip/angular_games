import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appGetCoordinates]',
  standalone: true,
})
export class GetCoordinatesDirective {

  canvas!: HTMLCanvasElement;
  coordinatesParagraph!: HTMLParagraphElement;

  constructor(private elementRef: ElementRef) {
    this.canvas = this.elementRef.nativeElement;
    this.coordinatesParagraph = document.createElement('p');
    this.canvas.parentElement?.appendChild(this.coordinatesParagraph);
  }

  @HostListener('mousemove', [ '$event' ])
  getCoordinates(event: MouseEvent): void {
    const x = event.offsetX;
    const y = event.offsetY;

    this.coordinatesParagraph.innerText = `x: ${x}, y: ${y}`;
  }
}
