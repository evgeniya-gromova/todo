import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, NgClass} from '@angular/common';
import {map, Observable, of, Subject} from 'rxjs';
import {DateTimeAgoPipe} from '../shared/date-time-ago.pipe';
import {Todo} from '../shared/todo.interface';
import {ApiService} from '../shared/api.service';
import {ActivatedRoute} from '@angular/router';

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
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnDestroy, OnInit {
  destroy$ = new Subject<boolean>();
  mode$: Observable<'list' | 'favorite'> = of('list');
  dataSource$: Observable<Todo[]> = of([]);

  displayedColumns: string[] = ['isDone', 'title', 'expirationDate', 'expirationTime', 'isFavorite', 'delete'];

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.dataSource$ = this.apiService.getTodoList();
    this.mode$ = this.route.data.pipe(map(data=> data['mode'] || 'list'));

  }

  toggleFavorite(element: Todo) {
    this.dataSource$ = this.apiService.updateTodo({...element, isFavorite: !element.isFavorite});
  }
  toggleDone(element: Todo) {
    this.dataSource$ = this.apiService.updateTodo({...element, isDone: !element.isDone});
  }

  deleteTodo(element: Todo) {
    this.dataSource$ = this.apiService.deleteTask(element);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
