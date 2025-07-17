import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioMap: Map<string, HTMLAudioElement> = new Map();
  private ambientAudio: HTMLAudioElement | null = null;

  private readonly sounds = {
    move: 'assets/sounds/move.mp3',
    // flag: 'assets/sounds/flag.mp3',
    // win: 'assets/sounds/win.mp3',
    // lose: 'assets/sounds/lose.mp3',
    ambient: 'assets/sounds/ambient_nature.mp3',
  };

  constructor() {
    this.preloadSounds();
  }

  private preloadSounds() {
    Object.entries(this.sounds).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.load();
      this.audioMap.set(key, audio);
    });
  }

  async play(soundKey: keyof typeof this.sounds) {
    const source = this.audioMap.get(soundKey);

    if (!source) return;

    try {
      const instance = source.cloneNode(true) as HTMLAudioElement;
      instance.currentTime = 0;
      instance.volume = 0.2;
      await instance.play();
    } catch (err) {
      console.warn(`Sound "${soundKey}" failed to play`, err);
    }
  }

  startAmbient() {
    if (this.ambientAudio) return;

    const ambient = this.audioMap.get('ambient');
    if (!ambient) return;

    this.ambientAudio = ambient;
    ambient.loop = true;
    ambient.volume = 0.5;
    ambient.play().catch((e) => console.warn('Ambient failed to start', e));
  }

  stopAmbient() {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
      this.ambientAudio = null;
    }
  }
}
