import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CowComponent } from './components/cow/cow.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'moosweep';
  cowX = 0;
  cowY = 0;
  direction: 'up' | 'down' | 'left' | 'right' = 'down';

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      event.preventDefault();
      switch (event.key) {
        case 'ArrowUp':
          this.move('up');
          break;
        case 'ArrowDown':
          this.move('down');
          break;
        case 'ArrowLeft':
          this.move('left');
          break;
        case 'ArrowRight':
          this.move('right');
          break;
      }
    }
  }

  move(dir: 'up' | 'down' | 'left' | 'right') {
    this.direction = dir;

    switch (dir) {
      case 'up':
        this.cowY = Math.max(0, this.cowY - 1);
        break;
      case 'down':
        this.cowY = Math.min(8, this.cowY + 1);
        break;
      case 'left':
        this.cowX = Math.max(0, this.cowX - 1);
        break;
      case 'right':
        this.cowX = Math.min(8, this.cowX + 1);
        break;
    }
  }
}
