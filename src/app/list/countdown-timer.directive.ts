import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { formatDate } from '@angular/common';

@Directive({
  selector: '[countdownTimer]',
  standalone: true,
  exportAs: 'countdownTimer',
})
export class CountdownTimerDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input('countdownTimerExpirationDate') expirationDate!: string;
  @Input('countdownTimerExpirationTime') expirationTime!: string;

  private nowSignal = signal(new Date());

  countdown = computed(() => {
    // expirationTime не обяательное поле
    if (this.expirationTime.length === 0) {
      return formatDate(this.expirationDate, 'MMM d, y', 'en-US');
    }

    const expiration = new Date(this.expirationDate);
    const [expirationHours, expirationMinutes] = this.expirationTime.split(':');
    expiration.setHours(+expirationHours);
    expiration.setMinutes(+expirationMinutes);

    const now = this.nowSignal();
    const diffMs = expiration.getTime() - now.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    // если таймер вышел или разница меньше часа
    if (diffSec <= 0 || diffSec > 3600) {
      return diffSec > 60 * 60 * 24
        ? formatDate(this.expirationDate, 'MMM d, y', 'en-US')
        : this.expirationTime;
    }

    const minutes = Math.floor(diffSec / 60);
    const seconds = diffSec % 60;

    return `0h ${minutes}m ${seconds}s`;
  });

  ngOnInit() {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.nowSignal.set(new Date()));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
