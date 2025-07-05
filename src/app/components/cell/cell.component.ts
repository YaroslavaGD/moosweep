import { Component } from '@angular/core';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss',
})
export class CellComponent {
  row = Math.floor(Math.random() * 5);
  column = Math.floor(Math.random() * 11);
  x = this.column * 64;
  y = this.row * 64;

  get backgroundPosition(): string {
    return `-${this.x}px -${this.y}px`;
  }
}
