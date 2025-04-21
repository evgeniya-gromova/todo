import { Component } from '@angular/core';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {Todo} from '../todo.interface';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, NgClass} from '@angular/common';
import {DateTimeAgoPipe} from '../date-time-ago.pipe';

const ELEMENT_DATA: Todo[] = [
  {title: 'Hydrogen', expirationDate: '2025-04-21T22:00:00.000Z', expirationTime: '2025-04-21T00:30:00.000Z', isFavorite:true, isDone: false},
  {title: 'Helium',expirationDate: '2025-04-21T22:00:00.000Z', expirationTime: '2025-04-21T00:30:00.000Z', isFavorite:true, isDone: false},
  {title: 'Lithium', expirationDate: '2025-04-21T22:00:00.000Z', expirationTime: '2025-04-21T00:30:00.000Z', isFavorite:true, isDone: false},
  {title: 'Beryllium', expirationDate: '2025-04-21T22:00:00.000Z', expirationTime: '2025-04-21T00:30:00.000Z', isFavorite:true, isDone: false},
  {title: 'Boron', expirationDate: '2025-04-21T22:00:00.000Z', expirationTime: '2025-04-21T00:30:00.000Z', isFavorite:true, isDone: false},
  {title: 'Carbon', expirationDate: '2025-04-21T22:00:00.000Z', expirationTime: '2025-04-21T00:30:00.000Z', isFavorite:true, isDone: false},
  {title: 'Nitrogen', expirationDate: '2025-04-21T22:00:00.000Z', expirationTime: '2025-04-21T00:30:00.000Z', isFavorite:true, isDone: false},
  {title: 'Oxygen', expirationDate: '2025-04-21T22:00:00.000Z', expirationTime: '2025-04-21T00:30:00.000Z', isFavorite:true, isDone: false},
  {title: 'Fluorine', expirationDate: '2025-04-21T22:00:00.000Z', expirationTime: '2025-04-21T00:30:00.000Z', isFavorite:true, isDone: false},
  {title: 'Neon', expirationDate: '2025-04-21T22:00:00.000Z', expirationTime: '2025-04-21T00:30:00.000Z', isFavorite:true, isDone: false},
];
@Component({
  selector: 'app-table',
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
    DateTimeAgoPipe
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  displayedColumns: string[] = ['isDone', 'title', 'expirationDate', 'expirationTime', 'isFavorite', 'delete'];
  dataSource = ELEMENT_DATA;
}
