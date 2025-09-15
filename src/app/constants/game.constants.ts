export const TILE_SIZE = 80; //128
export const GRID_SIZE = {
  ROW: 9,
  COLUMN: 9,
  BLOCK: 3,
};
export const CELL_NUMBER = GRID_SIZE.COLUMN * GRID_SIZE.ROW;
export const MINE_NUMBER = CELL_NUMBER / (GRID_SIZE.BLOCK * GRID_SIZE.BLOCK);
export const GRASS_NUMBER = CELL_NUMBER - MINE_NUMBER;
export const GRASS_SPRITE_SIZE = {
  ROW: 3, //5
  COLUMN: 3, //11
};
export const COW_FRAME_NUMBER = 3;

export type Direction = 'up' | 'down' | 'left' | 'right';
