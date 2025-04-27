import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'dateTimeAgo',
  standalone: true,
})
export class DateTimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number): string {
    if (!value) return 'invalid date' + value;
    const date = new Date(value);
    const now = new Date();

    // Not today
    if (date.toDateString() !== now.toDateString()) {
      return formatDate(value, 'MMM d, y', 'en-US');
    }

    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return 'только что';
    if (diffMinutes < 60) return `${diffMinutes} мин назад`;

    const diffHours = Math.floor(diffMinutes / 60);
    console.log(
      date.toDateString(),
      now.toDateString(),
      now.getTime(),
      date.getTime(),
      diffHours
    );
    return `${diffHours} ч назад`;
  }
}
