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
