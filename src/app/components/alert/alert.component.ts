import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  @Input() open = false;
  @Input() result: 'win' | 'lose' | null = null;
  @Output() closed = new EventEmitter<void>();

  onClose() {
    this.closed.emit();
  }
}
