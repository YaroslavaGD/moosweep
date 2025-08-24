import {
  Component,
  HostListener,
  inject,
  Input,
  OnChanges,
} from '@angular/core';
import { Cell } from '../../models/cell.model';
import { BoardService } from '../../services/board.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss',
})
export class CellComponent implements OnChanges {
  @Input({ required: true }) cell!: Cell;

  private readonly boardService = inject(BoardService);
  readonly direction = toSignal(this.boardService.direction$);
  readonly gameResult = toSignal(this.boardService.gameResult$, {
    initialValue: null,
  });

  get backgroundPosition(): string {
    return `-${this.cell.spriteX}px -${this.cell.spriteY}px`;
  }
  delayedContent: string | null = null;
  isVisibleMine = false;

  ngOnChanges() {
    if (this.cell.revealed && this.cell.smell) {
      setTimeout(() => {
        this.delayedContent = this.cell.smell
          ? this.cell.smell.toString()
          : null;
      }, 350);
    } else {
      this.delayedContent = null;
    }
  }

  get displayHint(): boolean {
    return (this.cell.flagged && !this.cell.revealed) || false;
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();

    if (!this.cell.revealed) {
      this.boardService.flagCell(this.cell.x, this.cell.y);
      this.cell.flagged = !this.cell.flagged;
    }
  }

  @HostListener('click', ['$event'])
  onLeftClick() {
    if (this.cell.flagged) return;
    this.boardService.tryToMove(this.cell.x, this.cell.y);
  }

  showMine() {
    return this.gameResult() === 'lose' && this.cell.hasMine;
  }
}
