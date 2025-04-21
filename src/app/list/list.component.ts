import { Component } from '@angular/core';
import {TableComponent} from '../shared/table/table.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    TableComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

}
