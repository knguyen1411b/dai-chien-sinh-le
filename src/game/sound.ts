const audioFiles = import.meta.glob('../../assets/audio/*.wav', {eager:true, query:'?url', import:'default'}) as Record<string,string>;
class FolkSoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private buffers = new Map<string, AudioBuffer>();
  private music: AudioBufferSourceNode | null = null;
  private musicGain: GainNode | null = null;
  private musicStage = 0;
  private musicOffset = 0;
  private musicStarted = 0;
  private voices = 0;
  public async prepare(): Promise<void> {
    const ctx = this.ensureContext(); if (!ctx || this.buffers.size) return;
    await Promise.all(Object.entries(audioFiles).map(async ([path,url]) => {
      const response=await fetch(url); if (!response.ok) throw new Error('Không tải được âm thanh');
      const buffer=await ctx.decodeAudioData(await response.arrayBuffer());
      this.buffers.set(path.split('/').pop()!.replace('.wav',''),buffer);
    }));
  }
  public now(): number { return this.ctx?.currentTime ?? performance.now()/1000; }
  public playEffect(name: string): void {
    const ctx=this.ctx, buffer=this.buffers.get(name); if(!ctx||!buffer||this.muted||this.voices>=12)return;
    const src=ctx.createBufferSource(),gain=ctx.createGain();src.buffer=buffer;src.playbackRate.value=.97+Math.random()*.06;
    gain.gain.value=.45;src.connect(gain);gain.connect(ctx.destination);this.voices++;
    src.onended=()=>{this.voices--;src.disconnect();gain.disconnect();};src.start();
  }
  public startMusic(stage: number): void {
    this.stopMusic();this.musicStage=stage;this.musicOffset=0;this.resumeMusic();
  }
  private resumeMusic(): void {
    const ctx=this.ctx,buffer=this.buffers.get('music-'+this.musicStage);if(!ctx||!buffer||this.music)return;
    const src=ctx.createBufferSource(),gain=ctx.createGain();src.buffer=buffer;src.loop=true;gain.gain.value=this.muted?0:.38;
    src.connect(gain);gain.connect(ctx.destination);this.music=src;this.musicGain=gain;this.musicStarted=ctx.currentTime;
    src.start(0,this.musicOffset%buffer.duration);
  }
  public pauseMusic(paused: boolean): void {
    if(paused&&this.music){this.musicOffset+=this.now()-this.musicStarted;this.music.stop();this.music.disconnect();this.musicGain?.disconnect();this.music=null;this.musicGain=null;}
    if(!paused&&this.musicStage)this.resumeMusic();
  }
  public stopMusic(): void {
    this.music?.stop();this.music?.disconnect();this.musicGain?.disconnect();this.music=null;this.musicGain=null;this.musicStage=0;
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if(this.musicGain)this.musicGain.gain.value=this.muted?0:.38;
    if (!this.muted) {
      this.playPluck(523.25, 0.12);
    }
    return this.muted;
  }

  // Vietnamese pentatonic scale pluck (Đàn Tranh inspired)
  public playPluck(freq = 440, duration = 0.22, volume = 0.14): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.992, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  // Festive folk drum (Trống Hội "TÙNG!")
  public playDrum(pitch = 130, volume = 0.25): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch * 1.45, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.55, now + 0.18);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Rim click ("CẮC!")
  public playRimClick(volume = 0.16): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.045);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playLassoLaunch(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playCaptureSuccess(special = false): void {
    const notes = special ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25, 783.99];
    notes.forEach((n, idx) => {
      window.setTimeout(() => this.playPluck(n, 0.24, special ? 0.18 : 0.14), idx * 65);
    });
  }

  public playMissOrHit(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(85, now + 0.22);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playDash(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.1);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playRockRaise(): void {
    this.playDrum(110, 0.22);
    window.setTimeout(() => this.playPluck(392, 0.14, 0.1), 40);
  }

  public playUltimateLandslide(): void {
    const notes = [110, 146.8, 196, 293.66, 440, 587.33];
    notes.forEach((n, i) => {
      window.setTimeout(() => {
        if (i < 2) this.playDrum(n, 0.28);
        else this.playPluck(n, 0.3, 0.16);
      }, i * 55);
    });
  }

  public playStageWin(): void {
    // Vietnamese pentatonic triumphant motif (C - D - E - G - A - C)
    const melody = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    melody.forEach((freq, i) => {
      window.setTimeout(() => {
        this.playPluck(freq, 0.32, 0.18);
        if (i === 0 || i === 5) this.playDrum(120, 0.2);
      }, i * 90);
    });
  }

  public playStageLose(): void {
    const melody = [392, 349.23, 329.63, 261.63];
    melody.forEach((freq, i) => {
      window.setTimeout(() => this.playPluck(freq, 0.3, 0.15), i * 130);
    });
  }
}

export const soundEngine = new FolkSoundEngine();
