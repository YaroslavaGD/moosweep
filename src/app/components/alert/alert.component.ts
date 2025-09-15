import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,
  SimpleChanges,
  ViewChild,
  HostListener,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent implements AfterViewInit, OnChanges {
  @Input() open = false;
  @Input() result: 'win' | 'lose' | null = null;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit(): void {
    if (this.open) {
      this.focusButton();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']?.currentValue) {
      this.focusButton();
    }
  }

  private focusButton() {
    queueMicrotask(() => this.closeBtn?.nativeElement.focus());
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.open) return;

    if (event.code === 'Enter' || event.code === 'Space') {
      event.preventDefault();

      const btn = this.closeBtn?.nativeElement;
      if (btn) {
        btn.classList.add('pressed');

        setTimeout(() => {
          btn.classList.remove('pressed');
          btn.click();
        }, 150);
      }
    }
  }

  onClose() {
    this.closed.emit();
  }
}
