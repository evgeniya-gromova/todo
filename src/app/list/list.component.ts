import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, NgClass } from '@angular/common';
import { catchError, map, of } from 'rxjs';
import { DateTimeAgoPipe } from '../shared/date-time-ago.pipe';
import { Todo } from '../shared/todo.interface';
import { ApiService } from '../shared/api.service';
import { ActivatedRoute } from '@angular/router';
import { isSameDayFunction } from '../shared/is-same-day.function';
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatCheckbox,
    MatIcon,
    NgClass,
    DatePipe,
    DateTimeAgoPipe,
    DateTimeAgoPipe,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  private readonly apiService = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly todos = signal<Todo[]>([]);
  readonly error = signal<string | null>(null);
  readonly loading = signal<boolean>(false);

  private readonly mode$ = this.route.data.pipe(
    map(data => data['mode'] || 'list')
  );
  readonly mode = toSignal(this.mode$, { initialValue: 'list' });

  readonly todayTodoList = computed(() =>
    this.todos().filter(todo =>
      isSameDayFunction(new Date(todo.expirationDate), new Date())
    )
  );
  readonly upcomingTodoList = computed(() =>
    this.todos().filter(
      todo => !isSameDayFunction(new Date(todo.expirationDate), new Date())
    )
  );
  readonly favoriteTodoList = computed(() =>
    this.todos().filter(todo => todo.isFavorite)
  );

  displayedColumns: string[] = [
    'isDone',
    'title',
    'expirationDate',
    'expirationTime',
    'isFavorite',
    'delete',
  ];

  constructor() {
    effect(() => {
      this.loading.set(true);
      this.error.set(null);

      this.apiService.getTodoList();
      this.apiService
        .getTodoList()
        .pipe(
          catchError(err => {
            this.error.set('Ошибка при загрузке данных');
            return of([]);
          })
        )
        .subscribe(result => {
          this.todos.set(result);
          this.loading.set(false);
        });
    });
  }

  toggleFavorite(todo: Todo) {
    const updated = { ...todo, isFavorite: !todo.isFavorite };

    this.apiService
      .updateTodo(updated)
      .pipe(
        catchError(err => {
          this.error.set('Ошибка при обновлении избранного');
          return of(null);
        })
      )
      .subscribe(result => {
        if (result) this.todos.set(result);
      });
  }

  toggleDone(todo: Todo) {
    const updated = { ...todo, isDone: !todo.isDone };

    this.apiService
      .updateTodo(updated)
      .pipe(
        catchError(err => {
          this.error.set('Ошибка при обновлении статуса');
          return of(null);
        })
      )
      .subscribe(result => {
        if (result) this.todos.set(result);
      });
  }

  deleteTodo(todo: Todo) {
    this.apiService
      .deleteTask(todo)
      .pipe(
        catchError(err => {
          this.error.set('Ошибка при удалении');
          return of(null);
        })
      )
      .subscribe(result => {
        if (result !== null) {
          this.todos.set(result);
        }
      });
  }
}
