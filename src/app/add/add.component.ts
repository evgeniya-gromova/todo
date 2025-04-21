import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerToggle,
} from '@angular/material/timepicker';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ApiService } from '../shared/api.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatButton,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatInput,
    MatTimepickerToggle,
    MatTimepicker,
    MatTimepickerInput,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatIcon,
    MatIconButton,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent implements OnDestroy {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  createDateValidator(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = control.value;
      if (
        selectedDate &&
        selectedDate < new Date(minDate.setHours(0, 0, 0, 0))
      ) {
        return { dateTooEarly: true };
      }
      return null;
    };
  }

  destroy$ = new Subject<boolean>();

  minDate = new Date();

  todoForm = new FormGroup({
    expirationDate: new FormControl<Date | null>(null, [
      Validators.required,
      this.createDateValidator(this.minDate),
    ]),
    expirationTime: new FormControl<Date | null>(null),
    title: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
  });

  get expirationDate() {
    return this.todoForm.get('expirationDate');
  }

  get expirationTime() {
    return this.todoForm.get('expirationTime');
  }

  get title() {
    return this.todoForm.get('title');
  }

  reset(event: MouseEvent, control: AbstractControl | null) {
    event.stopPropagation();
    control?.reset();
  }

  addTodo() {
    this.todoForm.updateValueAndValidity();

    if (!this.todoForm.valid) return;

    this.apiService
      .addTodo({
        expirationDate: this.expirationDate?.value?.toISOString() || '',
        expirationTime: this.expirationTime?.value?.toISOString() || '',
        title: this.title?.value || '',
        isDone: false,
        isFavorite: false,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log(data);
        this.router.navigate(['/list']);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
