import { Component, inject, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../services/board.service';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  readonly audioService = inject(AudioService);
  readonly boardService = inject(BoardService);
  volume!: number;
  prevVolume!: number;
  isOpen = false;
  isMuted = false;

  ngOnInit() {
    this.volume = this.audioService.getGlobalVolume();
    this.prevVolume = this.volume;
  }

  onVolumeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.valueAsNumber;
    this.volume = newValue;
    this.prevVolume = newValue > 0 ? newValue : this.prevVolume;
    this.isMuted = newValue === 0;
    this.audioService.setGlobalVolume(newValue);
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.audioService.setGlobalVolume(0);
      this.volume = 0;
    } else {
      this.volume = this.prevVolume || 0.5;
      this.audioService.setGlobalVolume(this.volume);
    }
  }

  onResetClick() {
    this.toggleMenu();
    this.boardService.resetGame();
  }
}
