import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { boardSize } from '../../../shared/state/shared-selectors';
import { BoardSize } from '../../../shared/models/BoardSize';
import { setBoardSize } from '../../../shared/state/shared-actions';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-snake-settings',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './snake-settings.component.html',
  styleUrl: './snake-settings.component.scss',
})
export class SnakeSettingsComponent implements OnInit {
  form!: FormGroup;
  showSettings = false;

  store = inject(Store);
  subscription!: Subscription;

  ngOnInit(): void {
    this.form = new FormBuilder().group({
      rows: [ '', [ Validators.pattern(/^[0-9]*$/), Validators.required ] ],
      columns: [ '', [ Validators.pattern(/^[0-9]*$/), Validators.required ] ],
    });

    this.store.select(boardSize).subscribe((size: BoardSize) => {
      const formRows = this.form.controls['rows'];
      const formColumns = this.form.controls['columns'];

      if (size.rows !== formRows.value) {
        formRows.setValue(size.rows);
      }
      if (size.columns !== formColumns.value) {
        formColumns.setValue(size.columns);
      }
    }).unsubscribe();

    this.subscription = this.form.valueChanges.pipe(
      debounceTime(150),
      distinctUntilChanged()
    ).subscribe(() => {
      if (this.form.valid) {
        const newBoardSize: BoardSize = {
          rows: this.form.controls['rows'].value,
          columns: this.form.controls['columns'].value,
        };
        this.store.dispatch(setBoardSize({ boardSize: newBoardSize }));
      }
    });
  }
}
