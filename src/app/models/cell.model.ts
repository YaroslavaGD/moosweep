export interface Cell {
  x: number;
  y: number;
  hasMine: boolean;
  revealed: boolean;
  smell?: number;
  flagged?: boolean;
  path?: boolean;
  spriteX: number;
  spriteY: number;
}
