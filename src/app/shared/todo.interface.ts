export interface Todo {
  title: string;
  expirationDate: string;
  expirationTime: string;
  isFavorite: boolean;
  isDone: boolean;
}

export interface TodoState {
  isLoading: boolean;
  todoList: Todo[];
  error: string | null;
}
export enum StoreActionsTitles {
  GetTodos = 'getTodos',
  UpdateTodo = 'updateTodo',
  DeleteTodo = 'deleteTodo',
  ShowError = 'showError',
}

export type StoreAction =
  | { action: StoreActionsTitles.GetTodos }
  | { action: StoreActionsTitles.UpdateTodo; property: Todo }
  | { action: StoreActionsTitles.DeleteTodo; property: Todo }
  | { action: StoreActionsTitles.ShowError; property: any };
