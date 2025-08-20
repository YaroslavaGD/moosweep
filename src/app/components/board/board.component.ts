import { Component, HostListener, inject } from '@angular/core';
import { CowComponent } from '../cow/cow.component';
import { CellComponent } from '../cell/cell.component';
import { CommonModule } from '@angular/common';
import { Direction, GRASS_NUMBER } from '../../constants/game.constants';
import { BoardService } from '../../services/board.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SettingsComponent } from '../settings/settings.component';
import { AlertComponent } from '../alert/alert.component';
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    CowComponent,
    CellComponent,
    SettingsComponent,
    AlertComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  readonly boardService = inject(BoardService);

  readonly cells = toSignal(this.boardService.cellReversed$);
  readonly playerPosition = toSignal(this.boardService.playerPosition$);
  readonly direction = toSignal(this.boardService.direction$);
  readonly currentGrass = toSignal(this.boardService.revealedNumber$);
  readonly totalGrass = GRASS_NUMBER;
  readonly gameResult = toSignal(this.boardService.gameResult$, {
    initialValue: null,
  });

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const keyMap: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      KeyW: 'up',
      KeyA: 'left',
      KeyS: 'down',
      KeyD: 'right',
    };
    const dir = keyMap[event.code];

    if (dir) {
      event.preventDefault();
      this.boardService.move(dir);
    }
  }

  readonly dialogOpen = () => this.gameResult() !== null;

  onDialogClosed() {
    this.boardService.resetGame();
  }
}
