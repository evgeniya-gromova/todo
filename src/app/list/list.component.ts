import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
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
import { Todo } from '../shared/todo.interface';
import { ActivatedRoute } from '@angular/router';
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { StoreService } from '../shared/store.service';
import { CountdownTimerDirective } from './countdown-timer.directive';
import { LoadingOverlayComponent } from '../shared/loading-overlay/loading-overlay.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// проверка, что не все строки спамят при таймере
@Component({
  selector: 'app-name-cell',
  standalone: true,
  template: '{{ displayedName }}',
})
export class NameCellComponent {
  @Input() name!: string;

  get displayedName() {
    console.log('NameCellComponent: change detection', this.name);
    return this.name;
  }
}

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
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionModule,
    MatButton,
    CountdownTimerDirective,
    NameCellComponent,
    LoadingOverlayComponent,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  private readonly storeService = inject(StoreService);
  private readonly route = inject(ActivatedRoute);
  private readonly breakpointObserver = inject(BreakpointObserver);

  isMobile$ = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map(result => result.matches));

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

  ngOnInit() {
    this.storeService.getTodos();
  }

  toggleFavorite(todo: Todo) {
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
