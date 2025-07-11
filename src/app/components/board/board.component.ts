import { Component, HostListener, inject } from '@angular/core';
import { CowComponent } from '../cow/cow.component';
import { CellComponent } from '../cell/cell.component';
import { CommonModule } from '@angular/common';
import { Direction } from '../../constants/game.constants';
import { BoardService } from '../../services/board.service';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, CowComponent, CellComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  readonly boardService = inject(BoardService);

  readonly cells = this.boardService.cells;
  readonly playerPosition = toSignal(this.boardService.playerPosition$);
  readonly direction = toSignal(this.boardService.direction$);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const keyMap: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    };
    const dir = keyMap[event.key];

    if (dir) {
      event.preventDefault();
      this.boardService.move(dir);
    }
  }
}
