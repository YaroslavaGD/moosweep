import { Component } from '@angular/core';
import { GRASS_SPRITE_SIZE, TILE_SIZE } from '../../constants';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss',
})
export class CellComponent {
  row = Math.floor(Math.random() * GRASS_SPRITE_SIZE.ROW);
  column = Math.floor(Math.random() * GRASS_SPRITE_SIZE.COLUMN);
  x = this.column * TILE_SIZE;
  y = this.row * TILE_SIZE;

  get backgroundPosition(): string {
    return `-${this.x}px -${this.y}px`;
  }
}
