import { Component, effect, inject } from '@angular/core';
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
import { map } from 'rxjs';
import { DateTimeAgoPipe } from '../shared/date-time-ago.pipe';
import { Todo } from '../shared/todo.interface';
import { ActivatedRoute } from '@angular/router';
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { StoreService } from '../shared/store.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
    MatButton,
    MatProgressSpinner,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  private readonly storeService = inject(StoreService);
  private readonly route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  private readonly mode$ = this.route.data.pipe(
    map(data => data['mode'] || 'list')
  );
  readonly mode = toSignal(this.mode$, { initialValue: 'list' });

  readonly todayTodoList = this.storeService.todayTodoList;
  readonly upcomingTodoList = this.storeService.upcomingTodoList;
  readonly favoriteTodoList = this.storeService.favoriteTodoList;
  readonly error = this.storeService.errorMessage;
  readonly loading = this.storeService.isLoading;

  displayedColumns: string[] = [
    'isDone',
    'title',
    'expirationDate',
    'expirationTime',
    'isFavorite',
    'delete',
  ];

  constructor() {
    this.storeService.getTodos();

    effect(() => {
      const error = this.storeService.errorMessage();
      if (error) {
        this.snackBar.open(error, 'Закрыть', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    });
  }

  toggleFavorite(todo: Todo) {
    console.log('click!!');
    const updated = { ...todo, isFavorite: !todo.isFavorite };
    this.storeService.updateTodo(updated);
  }

  toggleDone(todo: Todo) {
    const updated = { ...todo, isDone: !todo.isDone };
    this.storeService.updateTodo(updated);
  }

  deleteTodo(todo: Todo) {
    this.storeService.deleteTodo(todo);
  }

  showError() {
    this.storeService.showError({ expirationDate: new Date() });
  }
}
