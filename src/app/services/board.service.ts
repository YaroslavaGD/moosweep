import { Injectable } from '@angular/core';
import {
  Direction,
  GRASS_NUMBER,
  GRASS_SPRITE_SIZE,
  GRID_SIZE,
  TILE_SIZE,
} from '../constants/game.constants';
import { BehaviorSubject } from 'rxjs';
import { Cell } from '../models/cell.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private spriteSeed = Math.floor(Math.random() * 10000000);
  readonly gridSize = GRID_SIZE.ROW * GRID_SIZE.COLUMN;
  private _playerPosition = new BehaviorSubject<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  readonly playerPosition$ = this._playerPosition.asObservable();

  private isMoving = false;

  private _direction = new BehaviorSubject<Direction>('down');
  readonly direction$ = this._direction.asObservable();

  private _cells = new BehaviorSubject<Cell[]>([]);
  readonly cells$ = this._cells.asObservable();

  private _revealedNumber = new BehaviorSubject<number>(0);
  readonly revealedNumber$ = this._revealedNumber.asObservable();

  constructor() {
    this.generateCells();
  }

  private generateCells() {
    const cells: Cell[] = [];
    const width = GRID_SIZE.COLUMN;
    const height = GRID_SIZE.ROW;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const { spriteX, spriteY } = this.generateSprite(x, y);

        cells.push({
          x,
          y,
          hasMine: false,
          revealed: false,
          flagged: false,
          spriteX,
          spriteY,
        });
      }
    }

    for (let blockY = 0; blockY < height; blockY += GRID_SIZE.BLOCK) {
      for (let blockX = 0; blockX < width; blockX += GRID_SIZE.BLOCK) {
        this.placeMineInBlock(blockX, blockY, cells);
      }
    }

    this._cells.next(cells);
    this.revealCell(0, 0);
  }

  private generateSprite(
    x: number,
    y: number
  ): { spriteX: number; spriteY: number } {
    const row = this.pseudoHash(x + this.spriteSeed, y, GRASS_SPRITE_SIZE.ROW);
    const col = this.pseudoHash(
      y + this.spriteSeed,
      x,
      GRASS_SPRITE_SIZE.COLUMN
    );

    return {
      spriteX: col * TILE_SIZE,
      spriteY: row * TILE_SIZE,
    };
  }

  private pseudoHash(x: number, y: number, max: number) {
    const A = 73856093;
    const B = 19349663;

    const hash = (x * A) ^ (y * B);

    return Math.abs(hash) % max;
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
    if (this.isMoving) return;

    const prevPos = this._playerPosition.value;
    let { x, y } = prevPos;

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

    this.isMoving = true;
    setTimeout(() => {
      this.isMoving = false;
    }, 300);

    this._playerPosition.next({ x, y });
    this._direction.next(dir);

    this.revealCell(x, y);
    this.updateCell(prevPos.x, prevPos.y, (c) => ({
      ...c,
      revealed: true,
      smell: 0,
    }));
  }

  private revealCell(x: number, y: number) {
    const cell = this.getCell(x, y);
    if (!cell) return;

    const wasRevealed = cell.revealed;
    cell.revealed = true;

    if (!wasRevealed) {
      this._revealedNumber.next(this._revealedNumber.value + 1);
    }

    if (this._revealedNumber.value === GRASS_NUMBER) {
      setTimeout(() => {
        alert('КОНЕЦ');
        this.resetGame();
        return;
      }, 500);
    }

    if (cell.hasMine) {
      setTimeout(() => {
        alert('ФУ! Коровка на мине!');
        this.resetGame();
        return;
      }, 500);
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
    this._revealedNumber.next(0);
    this.spriteSeed = Math.floor(Math.random() * 10000000);
    this.generateCells();
  }
}
