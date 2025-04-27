import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  signal,
  computed,
  effect,
} from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    const expiration = new Date(
      `${this.expirationDate}T${this.expirationTime}:00`
    );
    const now = this.nowSignal();
    const diffMs = expiration.getTime() - now.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec <= 0) {
      return 'Время вышло';
    }

    const minutes = Math.floor(diffSec / 60);
    const seconds = diffSec % 60;

    if (diffSec <= 3600) {
      // только если меньше часа
      return `Осталось ${minutes} мин ${seconds} сек`;
    } else {
      return null; // не показывать
    }
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
