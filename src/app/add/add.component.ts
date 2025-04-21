import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatTimepicker, MatTimepickerInput, MatTimepickerToggle } from '@angular/material/timepicker';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';

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
  styleUrl: './add.component.scss'
})
export class AddComponent {
  createDateValidator(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = control.value;
      if (selectedDate && selectedDate < new Date(minDate.setHours(0, 0, 0, 0))) {
        return { dateTooEarly: true };
      }
      return null;
    };
  }

  minDate = new Date();

  todoForm = new FormGroup({
    expirationDate: new FormControl(null, [Validators.required, this.createDateValidator(this.minDate)]),
    expirationTime: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
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
}
