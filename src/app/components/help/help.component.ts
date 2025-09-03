import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss',
})
export class HelpComponent {
  readonly boardService = inject(BoardService);
  private eRef = inject(ElementRef);
  isOpen = false;

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const path = event.composedPath();
    if (this.isOpen && !path.includes(this.eRef.nativeElement)) {
      this.isOpen = false;
    }
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  onResetClick() {
    this.toggleMenu();
    this.boardService.resetGame();
  }
}
