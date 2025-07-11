import { Injectable } from '@angular/core';
import { Direction, GRID_SIZE } from '../constants/game.constants';
import { BehaviorSubject } from 'rxjs';

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

  readonly cells = Array.from({ length: this.gridSize });

  move(dir: Direction) {
    this._direction.next(dir);
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
  }
}
