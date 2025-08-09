import { Component, inject, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  readonly audioService = inject(AudioService);
  volume!: number;

  ngOnInit() {
    this.volume = this.audioService.getGlobalVolume();
    console.log('volume =', this.volume);
  }

  onVolumeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.valueAsNumber;
    this.volume = newValue;
    this.audioService.setGlobalVolume(newValue);
  }
}
