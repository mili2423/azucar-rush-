// Procedural Web Audio API sound generator for Azúcar Rush
// Pre-synthesizes audio buffers to avoid creating oscillators and nodes on every action

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmInterval: any = null;
  private bgmOscs: OscillatorNode[] = [];
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private isSynthesizing: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        this.preRenderBuffers();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => { });
    }
  }

  // Pre-renderiza buffers de audio para sonidos recurrentes (cero CPU en tiempo de juego)
  private async preRenderBuffers() {
    if (this.isSynthesizing || !this.ctx) return;
    this.isSynthesizing = true;

    try {
      const sampleRate = this.ctx.sampleRate || 44100;

      // 1. Footstep buffer (0.09s)
      this.bufferCache.set('footstep', this.renderOffline(sampleRate, 0.09, (ctx, dest) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(95, 0);
        osc.frequency.exponentialRampToValueAtTime(30, 0.08);
        gain.gain.setValueAtTime(0.04, 0);
        gain.gain.exponentialRampToValueAtTime(0.001, 0.08);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(0);
        osc.stop(0.08);
      }));

      // 2. Pickup buffer (0.13s)
      this.bufferCache.set('pickup', this.renderOffline(sampleRate, 0.13, (ctx, dest) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, 0);
        osc.frequency.exponentialRampToValueAtTime(880, 0.12);
        gain.gain.setValueAtTime(0.15, 0);
        gain.gain.exponentialRampToValueAtTime(0.001, 0.12);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(0);
        osc.stop(0.12);
      }));

      // 3. Mixing churn buffer (0.1s)
      this.bufferCache.set('mix', this.renderOffline(sampleRate, 0.1, (ctx, dest) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, 0);
        osc.frequency.linearRampToValueAtTime(180, 0.09);
        gain.gain.setValueAtTime(0.07, 0);
        gain.gain.exponentialRampToValueAtTime(0.001, 0.09);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(0);
        osc.stop(0.09);
      }));

      // 4. Oven timer ding (0.65s)
      this.bufferCache.set('ovenDing', this.renderOffline(sampleRate, 0.65, (ctx, dest) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, 0);
        osc.frequency.exponentialRampToValueAtTime(800, 0.6);
        gain.gain.setValueAtTime(0.25, 0);
        gain.gain.exponentialRampToValueAtTime(0.001, 0.6);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(0);
        osc.stop(0.6);
      }));

      // 5. Customer bell (0.55s)
      this.bufferCache.set('customerBell', this.renderOffline(sampleRate, 0.55, (ctx, dest) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1567.98, 0);
        osc.frequency.exponentialRampToValueAtTime(1046.50, 0.5);
        gain.gain.setValueAtTime(0.15, 0);
        gain.gain.exponentialRampToValueAtTime(0.001, 0.5);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(0);
        osc.stop(0.5);
      }));

      // 6. Error buzzer (0.42s)
      this.bufferCache.set('error', this.renderOffline(sampleRate, 0.42, (ctx, dest) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, 0);
        osc.frequency.setValueAtTime(110, 0.15);
        gain.gain.setValueAtTime(0.2, 0);
        gain.gain.exponentialRampToValueAtTime(0.001, 0.4);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(0);
        osc.stop(0.4);
      }));

      // 7. Burn alert (0.35s)
      this.bufferCache.set('burnAlert', this.renderOffline(sampleRate, 0.35, (ctx, dest) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, 0);
        osc.frequency.setValueAtTime(240, 0.15);
        gain.gain.setValueAtTime(0.18, 0);
        gain.gain.exponentialRampToValueAtTime(0.001, 0.3);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(0);
        osc.stop(0.3);
      }));

      // 8. Success delivery (0.5s)
      this.bufferCache.set('successDelivery', this.renderOffline(sampleRate, 0.5, (ctx, dest) => {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, 0);
        gain1.gain.setValueAtTime(0.18, 0);
        gain1.gain.exponentialRampToValueAtTime(0.001, 0.3);
        osc1.connect(gain1);
        gain1.connect(dest);
        osc1.start(0);
        osc1.stop(0.3);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.51, 0.09);
        gain2.gain.setValueAtTime(0.2, 0.09);
        gain2.gain.exponentialRampToValueAtTime(0.001, 0.45);
        osc2.connect(gain2);
        gain2.connect(dest);
        osc2.start(0.09);
        osc2.stop(0.45);
      }));
    } catch (e) {
      console.warn('Audio pre-rendering error fallback', e);
    }
  }

  private renderOffline(
    sampleRate: number,
    duration: number,
    setup: (ctx: OfflineAudioContext, dest: AudioNode) => void
  ): AudioBuffer {
    const OfflineCtx = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    const offline = new OfflineCtx(1, Math.ceil(sampleRate * duration), sampleRate);
    setup(offline, offline.destination);
    let resultBuffer: AudioBuffer | null = null;
    offline.startRendering().then((buf: AudioBuffer) => {
      resultBuffer = buf;
    }).catch(() => { });
    return resultBuffer as any;
  }

  private playCached(name: string, fallback: () => void) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const cached = this.bufferCache.get(name);
    if (cached && this.masterGain) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = cached;
        source.connect(this.masterGain);
        source.start();
        return;
      } catch (e) { }
    }

    fallback();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1, this.ctx.currentTime);
    }
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(muted ? 0 : 0.05, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // 1. Footstep sound (reutiliza buffer pre-renderizado)
  public playFootstep() {
    this.playCached('footstep', () => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.08);
    });
  }

  // 2. Pick up item / ingredient pop
  public playPickup() {
    this.playCached('pickup', () => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.12);
    });
  }

  // 3. Mixing bowl churn
  public playMixSound() {
    this.playCached('mix', () => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.09);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.09);
    });
  }

  // 4. Mix completed chime
  public playMixSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const now = this.ctx!.currentTime + idx * 0.07;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 0.25);
    });
  }

  // 5. Oven timer ding
  public playOvenDing() {
    this.playCached('ovenDing', () => {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.6);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.6);
    });
  }

  // 6. Burnt alarm
  public playBurnAlert() {
    this.playCached('burnAlert', () => {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.setValueAtTime(240, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.3);
    });
  }

  // 7. Order served successfully
  public playSuccessDelivery() {
    this.playCached('successDelivery', () => {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(this.masterGain);
      osc1.start(now);
      osc1.stop(now + 0.3);
    });
  }

  // 8. Error buzzer
  public playError() {
    this.playCached('error', () => {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(110, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.4);
    });
  }

  // 9. Customer door/counter bell
  public playCustomerBell() {
    this.playCached('customerBell', () => {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1567.98, now);
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.5);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.5);
    });
  }

  // 10. Level won fanfare
  public playLevelWon() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const chords = [523.25, 659.25, 783.99, 1046.50];
    chords.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const now = this.ctx!.currentTime + idx * 0.12;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 0.6);
    });
  }

  // 11. Cozy Bakery Background Music
  public startBGM() {
    if (this.isBgmPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    if (!this.bgmGain) {
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain || this.ctx.destination);
    }

    const notes = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66], // G
    ];

    let chordIndex = 0;
    const playNextChord = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      const currentChord = notes[chordIndex % notes.length];
      chordIndex++;

      currentChord.forEach(freq => {
        try {
          const osc = this.ctx!.createOscillator();
          const noteGain = this.ctx!.createGain();
          const now = this.ctx!.currentTime;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          noteGain.gain.setValueAtTime(0.04, now);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

          osc.connect(noteGain);
          noteGain.connect(this.bgmGain!);

          osc.start(now);
          osc.stop(now + 1.8);
          this.bgmOscs.push(osc);

          // Limpiar array de oscs tras sonar
          setTimeout(() => {
            const idx = this.bgmOscs.indexOf(osc);
            if (idx > -1) this.bgmOscs.splice(idx, 1);
          }, 1900);
        } catch (e) { }
      });
    };

    playNextChord();
    this.bgmInterval = setInterval(playNextChord, 2000);
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    // Detener oscs activos inmediatamente
    this.bgmOscs.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) { }
    });
    this.bgmOscs = [];
  }
}

export const sounds = new SoundManager();
