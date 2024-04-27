import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TetrisBoardComponent } from './tetris-board.component';

describe('BoardComponent', () => {
  let component: TetrisBoardComponent;
  let fixture: ComponentFixture<TetrisBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TetrisBoardComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TetrisBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
