import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  readonly audioService = inject(AudioService);
  private eRef = inject(ElementRef);
  volume!: number;
  prevVolume!: number;
  isOpen = false;
  isMuted = false;

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const path = event.composedPath();
    if (this.isOpen && !path.includes(this.eRef.nativeElement)) {
      this.isOpen = false;
    }
  }

  ngOnInit() {
    this.volume = this.audioService.getGlobalVolume();
    this.prevVolume = this.volume;
    console.log('volume =', this.volume);
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
}
