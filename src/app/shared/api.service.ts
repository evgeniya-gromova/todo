import { inject, Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { map, Observable, switchMap } from 'rxjs';
import { Todo } from './todo.interface';
import { JSONSchemaArray } from '@ngx-pwa/local-storage/lib/validation/json-schema';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly storage = inject(StorageMap);

  private storageKey = 'todoList';
  private schema: JSONSchemaArray = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        expirationDate: {
          type: 'string',
        },
        expirationTime: {
          type: 'string',
        },
        isFavorite: {
          type: 'boolean',
        },
        isDone: {
          type: 'boolean',
        },
      },
      required: [
        'title',
        'expirationDate',
        'expirationTime',
        'isFavorite',
        'isDone',
      ],
    },
  };

  getTodoList(): Observable<Todo[]> {
    return this.storage
      .get<Todo[]>(this.storageKey, this.schema)
      .pipe(map(todoList => todoList ?? []));
  }

  setTodoList(todoList: Todo[]): Observable<undefined> {
    return this.storage.set(this.storageKey, todoList, this.schema);
  }

  addTodo(newTodo: Todo): Observable<Todo[]> {
    console.log(newTodo);
    return this.getTodoList().pipe(
      map(todoList => [newTodo, ...(todoList ?? [])]),
      switchMap(updatedTodos =>
        this.setTodoList(updatedTodos).pipe(map(() => updatedTodos))
      )
    );
  }

  addTodoWitError(newTodo: any): Observable<Todo[]> {
    console.log(newTodo);
    return this.getTodoList().pipe(
      map(todoList => [newTodo, ...(todoList ?? [])]),
      switchMap(updatedTodos =>
        this.setTodoList(updatedTodos).pipe(map(() => updatedTodos))
      )
    );
  }

  updateTodo(todoData: Todo): Observable<Todo[]> {
    return this.getTodoList().pipe(
      map(todoList => [
        ...todoList?.map(
          todo =>
            (todo.expirationDate === todoData.expirationDate &&
            todo.expirationTime === todoData.expirationTime &&
            todo.title === todoData.title
              ? todoData
              : todo) ?? []
        ),
      ]),
      switchMap(updatedTodos =>
        this.setTodoList(updatedTodos).pipe(map(() => updatedTodos))
      )
    );
  }

  deleteTask(todoData: Todo): Observable<Todo[]> {
    return this.getTodoList().pipe(
      map(
        todoList =>
          todoList?.filter(
            todo =>
              todo.expirationDate !== todoData.expirationDate ||
              todo.expirationTime !== todoData.expirationTime ||
              todo.title !== todoData.title
          ) ?? []
      ),
      switchMap(updatedTodos =>
        this.setTodoList(updatedTodos).pipe(map(() => updatedTodos))
      )
    );
  }
}
