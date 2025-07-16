import { Component, HostListener, inject, Input } from '@angular/core';
import { Cell } from '../../models/cell.model';
import { BoardService } from '../../services/board.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss',
  animations: [
    trigger('revealEffect', [
      state(
        'hidden',
        style({
          filter: 'brightness(1) sepia(0)',
        })
      ),
      state(
        'revealed',
        style({
          filter: 'brightness(1) sepia(0.3)',
        })
      ),
      transition('hidden => revealed', animate('700ms ease')),
    ]),
  ],
})
export class CellComponent {
  @Input({ required: true }) cell!: Cell;

  private readonly boardService = inject(BoardService);

  get backgroundPosition(): string {
    return `-${this.cell.spriteX}px -${this.cell.spriteY}px`;
  }

  get displayContent(): string {
    if (this.cell.flagged) {
      return '💩';
    }

    // if (this.cell.hasMine) {
    //   return '💥';
    // }
    return this.cell.smell && this.cell.revealed
      ? this.cell.smell.toString()
      : '';
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();

    this.boardService.flagCell(this.cell.x, this.cell.y);
    // if (!this.cell.revealed) {
    this.cell.flagged = !this.cell.flagged;
    // }
  }
}
