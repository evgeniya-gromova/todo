import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
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
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ApiService } from '../shared/api.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { TimeValidator } from './time.validator';
import { DateValidator } from './date.validator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todo } from '../shared/todo.interface';
import { LoadingOverlayComponent } from '../shared/loading-overlay/loading-overlay.component';

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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatIcon,
    MatIconButton,
    LoadingOverlayComponent,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private cd = inject(ChangeDetectorRef);

  destroy$ = new Subject<boolean>();

  minDate = new Date();
  isLoading: boolean = false;

  todoForm = new FormGroup({
    expirationDate: new FormControl<Date | null>(null, [
      Validators.required,
      DateValidator.validDate(this.minDate),
    ]),
    expirationTime: new FormControl<string | null>(null, [
      TimeValidator.validTime('expirationDate'),
    ]),
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

  ngOnInit(): void {
    this.expirationDate?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.expirationTime?.updateValueAndValidity();
      });
  }

  addTodo() {
    this.todoForm.updateValueAndValidity();

    if (!this.todoForm.valid) return;

    this.isLoading = true;
    const todo: Todo = {
      expirationDate: this.expirationDate?.value?.toISOString() || '',
      expirationTime: this.expirationTime?.value || '',
      title: this.title?.value || '',
      isDone: false,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    this.apiService
      .addTodo(todo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.cd.markForCheck();
          this.router.navigate(['/list']);
        },
        error: error => {
          this.isLoading = false;
          this.cd.markForCheck();
          this.snackBar.open(error, 'Закрыть', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  addTodoWithError() {
    this.todoForm.updateValueAndValidity();

    if (!this.todoForm.valid) return;

    this.isLoading = true;

    this.apiService
      .addTodoWitError({
        createdAt: new Date().toISOString(),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.cd.markForCheck();
          this.router.navigate(['/list']);
        },
        error: error => {
          this.isLoading = false;
          this.cd.markForCheck();
          this.snackBar.open(error, 'Закрыть', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
