type AudioSettings = { master: number; music: number; sfx: number; mute: boolean };
export class AudioManager {
  settings: AudioSettings = { master: 0.45, music: 0, sfx: 0.6, mute: false };
  private context?: AudioContext;
  private music?: { osc: OscillatorNode; gain: GainNode };
  constructor() {
    try {
      const s = JSON.parse(localStorage.getItem('side-effects-audio-1') ?? 'null');
      if (
        s &&
        ['master', 'music', 'sfx'].every((k) => typeof s[k] === 'number' && s[k] >= 0 && s[k] <= 1)
      )
        this.settings = s;
    } catch {
      /* Optional settings may be unavailable. */
    }
  }
  save() {
    try {
      localStorage.setItem('side-effects-audio-1', JSON.stringify(this.settings));
    } catch {
      /* Storage is optional. */
    }
    this.updateMusic();
  }
  unlock() {
    if (!this.context) this.context = new AudioContext();
    void this.context.resume();
    this.updateMusic();
  }
  play(category: 'ui' | 'card' | 'effect' | 'ambience' | 'music') {
    if (!this.context || this.settings.mute) return;
    const ctx = this.context,
      osc = ctx.createOscillator(),
      gain = ctx.createGain();
    osc.type = category === 'effect' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(
      category === 'card' ? 330 : category === 'effect' ? 180 : 520,
      ctx.currentTime,
    );
    osc.frequency.exponentialRampToValueAtTime(
      category === 'effect' ? 350 : 160,
      ctx.currentTime + 0.12,
    );
    gain.gain.setValueAtTime(0.06 * this.settings.master * this.settings.sfx, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }
  private updateMusic() {
    if (!this.context) return;
    if (!this.music) {
      const osc = this.context.createOscillator(),
        gain = this.context.createGain();
      osc.type = 'sine';
      osc.frequency.value = 110;
      osc.connect(gain).connect(this.context.destination);
      osc.start();
      this.music = { osc, gain };
    }
    this.music.gain.gain.setTargetAtTime(
      this.settings.mute ? 0 : 0.012 * this.settings.music * this.settings.master,
      this.context.currentTime,
      0.2,
    );
  }
  dispose() {
    this.music?.osc.stop();
    void this.context?.close();
  }
}
