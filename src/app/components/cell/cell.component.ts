import { Component, HostListener, inject, Input } from '@angular/core';
import { GRASS_SPRITE_SIZE, TILE_SIZE } from '../../constants/game.constants';
import { Cell } from '../../models/cell.model';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss',
})
export class CellComponent {
  @Input({ required: true }) cell!: Cell;

  private readonly boardService = inject(BoardService);

  row = Math.floor(Math.random() * GRASS_SPRITE_SIZE.ROW);
  column = Math.floor(Math.random() * GRASS_SPRITE_SIZE.COLUMN);
  x = this.column * TILE_SIZE;
  y = this.row * TILE_SIZE;

  get backgroundPosition(): string {
    return `-${this.x}px -${this.y}px`;
  }

  get displayContent(): string {
    if (this.cell.flagged) {
      return '💩';
    }

    if (this.cell.hasMine) {
      return '💥';
    }
    return this.cell.smell ? this.cell.smell.toString() : '';
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();

    this.boardService.flagCell(this.cell.x, this.cell.y);
    // if (this.cell.revealed) {
    this.cell.flagged = !this.cell.flagged;
    // }
  }
}
