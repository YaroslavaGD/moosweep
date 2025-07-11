import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { COW_FRAME_NUMBER, TILE_SIZE } from '../../constants';

@Component({
  selector: 'app-cow',
  standalone: true,
  imports: [],
  templateUrl: './cow.component.html',
  styleUrl: './cow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CowComponent implements OnChanges {
  @Input() direction: 'up' | 'down' | 'left' | 'right' = 'down';
  @Input() x: number = 0;
  @Input() y: number = 0;

  frame: number = 0;

  directionMap = {
    up: 0,
    left: 1,
    down: 2,
    right: 3,
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  get backgroundPosition(): string {
    const row = this.directionMap[this.direction];
    const x = this.frame * TILE_SIZE;
    const y = row * TILE_SIZE;
    return `-${x}px -${y}px`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['x'] || changes['y'] || changes['direction']) {
      this.animateWalk();
    }
  }

  animateWalk() {
    let step = 0;
    this.ngZone.runOutsideAngular(() => {
      const interval = setInterval(() => {
        this.ngZone.run(() => {
          this.frame = (this.frame + 1) % COW_FRAME_NUMBER;
          this.cdr.markForCheck();
          step++;
          if (step >= 4) clearInterval(interval);
        });
      }, 100);
    });
  }
}
