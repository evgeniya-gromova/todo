import { Component, Input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss',
  imports: [MatProgressSpinner],
})
export class LoadingOverlayComponent {
  @Input() isLoading: boolean = false;
}
