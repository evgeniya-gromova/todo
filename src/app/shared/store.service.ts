import { computed, inject, Injectable, signal } from '@angular/core';

import { ApiService } from './api.service';
import { Todo, TodoState } from './todo.interface';
import { isSameDayFunction } from './is-same-day.function';
import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
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

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly api = inject(ApiService);

  // Initial state
  private state = signal<TodoState>({
    isLoading: false,
    todoList: [],
    error: null,
  });

  // Selectors
  isLoading = computed(() => this.state().isLoading);
  todoList = computed(() => this.state().todoList);
  todayTodoList = computed(() =>
    this.state().todoList.filter(todo =>
      isSameDayFunction(new Date(todo.expirationDate), new Date())
    )
  );
  upcomingTodoList = computed(() =>
    this.state().todoList.filter(
      todo => !isSameDayFunction(new Date(todo.expirationDate), new Date())
    )
  );
  favoriteTodoList = computed(() =>
    this.state().todoList.filter(todo => todo.isFavorite)
  );
  errorMessage = computed(() => this.state().error);

  private actionsSubject = new Subject<{ action: string; property?: any }>();

  constructor() {
    this.actionsSubject
      .pipe(
        // Set the loading indicator
        tap(() => this.setLoadingIndicator(true)),
        // Set no error
        tap(() => this.setError(null)),

        switchMap(({ action, property }) => {
          console.log(action, property);
          switch (action) {
            case 'getTodos':
              return this.api.getTodoList().pipe(
                catchError(err => {
                  this.setError(err);
                  return of(null);
                })
              );
            case 'updateTodo':
              return this.api.updateTodo(property).pipe(
                catchError(err => {
                  this.setError(err);
                  return of(null);
                })
              );
            case 'deleteTodo':
              return this.api.deleteTask(property).pipe(
                catchError(err => {
                  this.setError(err);
                  return of(null);
                })
              );
            case 'showError':
              return this.api.addTodoWitError(property).pipe(
                catchError(err => {
                  this.setError(err);
                  return of(null);
                })
              );
            default:
              return this.api.getTodoList().pipe(
                catchError(err => {
                  this.setError(err);
                  return of(null);
                })
              );
          }
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
  }
  private setLoadingIndicator(isLoading: boolean) {
    this.state.update(state => ({
      ...state,
      isLoading: isLoading,
    }));
  }

  public getTodos() {
    this.actionsSubject.next({ action: 'getTodos' });
  }

  updateTodo(todo: Todo) {
    this.actionsSubject.next({ action: 'updateTodo', property: todo });
  }

  deleteTodo(todo: Todo) {
    this.actionsSubject.next({ action: 'deleteTodo', property: todo });
  }

  showError(todo: any) {
    this.actionsSubject.next({ action: 'showError', property: todo });
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
