import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class TimeValidator {
  static validTime(dateFieldName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const parent = control.parent;
      if (!parent) {
        return null;
      }

      const dateControl = parent.get(dateFieldName);
      if (!dateControl) {
        console.warn(`Не найдено поле даты: ${dateFieldName}`);
        return null;
      }

      const dateValue = dateControl.value;
      if (!dateValue) {
        return null;
      }

      // Проверка формата времени "HH:mm"
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(value)) {
        return { invalidFormat: true };
      }

      const [hours, minutes] = value.split(':').map(Number);
      const selectedDate = new Date(dateValue);
      const now = new Date();

      const fullDateTime = new Date(selectedDate);
      fullDateTime.setHours(hours, minutes, 0, 0);

      // Если дата сегодня — проверяем, что время в будущем
      const isToday =
        selectedDate.getFullYear() === now.getFullYear() &&
        selectedDate.getMonth() === now.getMonth() &&
        selectedDate.getDate() === now.getDate();

      if (isToday && fullDateTime < now) {
        return { pastTime: true };
      }

      return null;
    };
  }
}
