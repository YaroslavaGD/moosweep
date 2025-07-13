import { Component, Input } from '@angular/core';
import { GRASS_SPRITE_SIZE, TILE_SIZE } from '../../constants/game.constants';
import { Cell } from '../../models/cell.model';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss',
})
export class CellComponent {
  @Input({ required: true }) cell!: Cell;

  row = Math.floor(Math.random() * GRASS_SPRITE_SIZE.ROW);
  column = Math.floor(Math.random() * GRASS_SPRITE_SIZE.COLUMN);
  x = this.column * TILE_SIZE;
  y = this.row * TILE_SIZE;

  get backgroundPosition(): string {
    return `-${this.x}px -${this.y}px`;
  }

  get displayContent(): string {
    if (this.cell.hasMine) {
      return '💥';
    }
    return '';
  }
}
