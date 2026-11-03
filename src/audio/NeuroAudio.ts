class NeuroAudioController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.4;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
    try {
      const savedMute = localStorage.getItem('synapse_audio_mute');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
      const savedVol = localStorage.getItem('synapse_audio_vol');
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol) || 0.4;
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('synapse_audio_mute', String(muted));
    } catch {}
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('synapse_audio_vol', String(this.volume));
    } catch {}
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Action potential firing pulse (bio-electric synaptic impulse)
   */
  public playActionPotential(pitchMultiplier: number = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Bandpass biological resonance
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800 * pitchMultiplier, now);
      filter.Q.setValueAtTime(3.5, now);

      osc.type = 'sine';
      // Fast pitch drop mimicking depolarization spike
      const baseFreq = 540 * pitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq * 1.8, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.12);

      const peakGain = 0.18 * this.volume;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore audio synthesis errors
    }
  }

  /**
   * Sprout Synapse (when a new thought node or connection is formed)
   */
  public playSprout() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 660];

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        const peakGain = 0.12 * this.volume;
        gain.gain.setValueAtTime(0.001, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(peakGain, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.2);
      });
    } catch {}
  }

  /**
   * Prune Synapse (when a node or branch is deleted)
   */
  public playPrune() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.16);

      const peakGain = 0.1 * this.volume;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }
}

export const neuroAudio = new NeuroAudioController();
