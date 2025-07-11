import { Component, HostListener } from '@angular/core';
import { CowComponent } from '../cow/cow.component';
import { CellComponent } from '../cell/cell.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, CowComponent, CellComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  title = 'moosweep';
  cowX = 0;
  cowY = 0;
  direction: 'up' | 'down' | 'left' | 'right' = 'down';

  cellCount = 9;

  readonly cells = Array.from({ length: this.cellCount });

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
        this.cowX = Math.min(14, this.cowX + 1);
        break;
    }
  }
}
