import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { ApiService } from './api.service';
import {
  StoreAction,
  StoreActionsTitles,
  Todo,
  TodoState,
} from './todo.interface';
import { isSameDayFunction } from './is-same-day.function';
import { HttpErrorResponse } from '@angular/common/http';
import {
  catchError,
  delay,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly api = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);

  // Initial state
  private readonly state = signal<TodoState>({
    isLoading: false,
    todoList: [],
    error: null,
  });

  // Selectors
  readonly isLoading = computed(() => this.state().isLoading);
  readonly todoList = computed(() => this.state().todoList);
  readonly todayTodoList = computed(() =>
    this.state().todoList.filter(todo =>
      isSameDayFunction(new Date(todo.expirationDate), new Date())
    )
  );
  readonly upcomingTodoList = computed(() =>
    this.state().todoList.filter(
      todo => !isSameDayFunction(new Date(todo.expirationDate), new Date())
    )
  );
  readonly favoriteTodoList = computed(() =>
    this.state().todoList.filter(todo => todo.isFavorite)
  );
  readonly errorMessage = computed(() => this.state().error);

  private actionsSubject = new Subject<StoreAction>();

  constructor() {
    this.actionsSubject
      .pipe(
        // Set no error
        tap(() => this.setError(null)),
        // Set the loading indicator
        tap(() => this.setLoadingIndicator(true)),
        switchMap(actionObj => {
          const { action } = actionObj;
          const property =
            'property' in actionObj ? actionObj.property : undefined;

          const actionMap: Record<
            StoreActionsTitles,
            Observable<Todo[] | null>
          > = {
            [StoreActionsTitles.GetTodos]: this.api.getTodoList(),
            [StoreActionsTitles.UpdateTodo]: this.api.updateTodo(property),
            [StoreActionsTitles.DeleteTodo]: this.api.deleteTask(property),
            [StoreActionsTitles.ShowError]: this.api.addTodoWitError(property),
          };
          return actionMap[action].pipe(
            catchError(err => {
              this.setError(err);
              return of(null);
            })
          );
        }),

        // To see the loading message
        delay(400),
        takeUntilDestroyed()
      )
      .subscribe(todoList => {
        if (todoList) {
          this.setTodoList(todoList);
        }
      });

    effect(() => {
      const error = this.errorMessage();
      if (error) {
        this.snackBar.open(error, 'Закрыть', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    });
  }
  private setLoadingIndicator(isLoading: boolean) {
    this.state.update(state => ({
      ...state,
      isLoading: isLoading,
    }));
  }

  public getTodos() {
    this.actionsSubject.next({ action: StoreActionsTitles.GetTodos });
  }

  updateTodo(todo: Todo) {
    this.actionsSubject.next({
      action: StoreActionsTitles.UpdateTodo,
      property: todo,
    });
  }

  deleteTodo(todo: Todo) {
    this.actionsSubject.next({
      action: StoreActionsTitles.DeleteTodo,
      property: todo,
    });
  }

  showError(todo: any) {
    this.actionsSubject.next({
      action: StoreActionsTitles.ShowError,
      property: todo,
    });
  }

  private setTodoList(todos: Todo[]): void {
    this.state.update(state => ({
      ...state,
      todoList: todos,
      isLoading: false,
    }));
  }

  private setError(err: HttpErrorResponse | null): Observable<Todo[]> {
    const errorMessage = err ? setErrorMessage(err) : err;
    this.state.update(state => ({
      ...state,
      error: errorMessage,
      isLoading: false,
    }));
    return of([]);
  }
}

export function setErrorMessage(err: HttpErrorResponse): string {
  let errorMessage: string;
  if (err.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    errorMessage = `An error occurred: ${err.error.message}`;
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    errorMessage = `Backend returned code ${err.status}: ${err.message}`;
  }
  console.error(err);
  return errorMessage;
}
