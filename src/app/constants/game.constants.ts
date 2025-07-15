export const TILE_SIZE = 64;
export const GRID_SIZE = {
  ROW: 9,
  COLUMN: 15,
  BLOCK: 3,
};
export const CELL_NUMBER = GRID_SIZE.COLUMN * GRID_SIZE.ROW;
export const MINE_NUMBER = CELL_NUMBER / (GRID_SIZE.BLOCK * GRID_SIZE.BLOCK);
export const GRASS_NUMBER = CELL_NUMBER - MINE_NUMBER;
export const GRASS_SPRITE_SIZE = {
  ROW: 5,
  COLUMN: 11,
};
export const COW_FRAME_NUMBER = 4;

export type Direction = 'up' | 'down' | 'left' | 'right';
