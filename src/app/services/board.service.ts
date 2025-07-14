import { Injectable } from '@angular/core';
import { Direction, GRID_SIZE } from '../constants/game.constants';
import { BehaviorSubject } from 'rxjs';
import { Cell } from '../models/cell.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  readonly gridSize = GRID_SIZE.ROW * GRID_SIZE.COLUMN;
  private _playerPosition = new BehaviorSubject<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  readonly playerPosition$ = this._playerPosition.asObservable();

  private _direction = new BehaviorSubject<Direction>('down');
  readonly direction$ = this._direction.asObservable();

  // readonly cells: Cell[] = [];
  private _cells = new BehaviorSubject<Cell[]>([]);
  readonly cells$ = this._cells.asObservable();

  constructor() {
    this.generateCells();
  }

  private generateCells() {
    const cells: Cell[] = [];
    const width = GRID_SIZE.COLUMN;
    const height = GRID_SIZE.ROW;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        cells.push({
          x,
          y,
          hasMine: false,
          revealed: false,
          flagged: false,
        });
      }
    }

    for (let blockY = 0; blockY < height; blockY += GRID_SIZE.BLOCK) {
      for (let blockX = 0; blockX < width; blockX += GRID_SIZE.BLOCK) {
        this.placeMineInBlock(blockX, blockY, cells);
      }
    }

    this._cells.next(cells);
  }

  private placeMineInBlock(startX: number, startY: number, cells: Cell[]) {
    const candidates: Cell[] = [];

    for (let dy = 0; dy < GRID_SIZE.BLOCK; dy++) {
      for (let dx = 0; dx < GRID_SIZE.BLOCK; dx++) {
        const x = startX + dx;
        const y = startY + dy;

        if (x >= GRID_SIZE.COLUMN || y >= GRID_SIZE.ROW) continue;

        if (x === 0 && y === 0) continue;

        const cell = cells.find((c) => c.x === x && c.y === y);
        if (cell) candidates.push(cell);
      }
    }

    if (candidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      candidates[randomIndex].hasMine = true;
    }
  }

  getCell(x: number, y: number): Cell | undefined {
    return this._cells.value.find((cell) => cell.x === x && cell.y === y);
  }

  private updateCell(x: number, y: number, updater: (cell: Cell) => Cell) {
    const updatedCells = this._cells.value.map((cell) => {
      return cell.x === x && cell.y === y ? updater(cell) : cell;
    });

    this._cells.next(updatedCells);
  }

  move(dir: Direction) {
    const pos = this._playerPosition.value;
    let { x, y } = pos;

    switch (dir) {
      case 'up':
        y = Math.max(0, y - 1);
        break;
      case 'down':
        y = Math.min(GRID_SIZE.ROW - 1, y + 1);
        break;
      case 'left':
        x = Math.max(0, x - 1);
        break;
      case 'right':
        x = Math.min(GRID_SIZE.COLUMN - 1, x + 1);
        break;
    }

    this._playerPosition.next({ x, y });
    this._direction.next(dir);

    this.revealCell(x, y);
  }

  private revealCell(x: number, y: number) {
    const cell = this.getCell(x, y);
    if (!cell) return;

    cell.revealed = true;

    if (cell.hasMine) {
      alert('ФУ! Коровка на мине!');
      this.resetGame();
      return;
    }

    const smell = this.getSmell(x, y);

    this.updateCell(x, y, (c) => ({
      ...c,
      revealed: true,
      smell,
    }));
  }

  getSmell(x: number, y: number): number {
    return this.getNeighbors(x, y).filter((cell) => cell.hasMine).length;
  }

  getNeighbors(x: number, y: number): Cell[] {
    const neighbors: Cell[] = [];

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;

        const nx = x + dx;
        const ny = y + dy;

        if (nx < 0 || ny < 0 || nx >= GRID_SIZE.COLUMN || ny >= GRID_SIZE.ROW)
          continue;

        const neighbor = this.getCell(nx, ny);
        if (neighbor) neighbors.push(neighbor);
      }
    }

    return neighbors;
  }

  flagCell(x: number, y: number) {
    this.updateCell(x, y, (cell) => ({
      ...cell,
      flagged: !cell.flagged,
    }));
  }

  resetGame() {
    this._playerPosition.next({ x: 0, y: 0 });
    this._direction.next('down');
    this.generateCells();
  }
}
