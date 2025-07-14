export interface Cell {
  x: number;
  y: number;
  hasMine: boolean;
  revealed: boolean;
  smell?: number;
  flagged?: boolean;
  spriteX: number;
  spriteY: number;
}
