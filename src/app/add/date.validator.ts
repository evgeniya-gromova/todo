import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class DateValidator {
  static validDate(minDate: Date): ValidatorFn {
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
}
