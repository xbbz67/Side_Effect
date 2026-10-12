export interface AnimationTask {
  label: string;
  run: (signal: AbortSignal) => Promise<void>;
}
export class AnimationQueue {
  speed = 1;
  paused = false;
  current = '';
  frameStats = { frames: 0, averageFps: 0, worstFrameMs: 0 };
  pending: AnimationTask[] = [];
  private abort?: AbortController;
  private running?: Promise<void>;
  private listeners = new Set<() => void>();
  private generation = 0;
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  private notify() {
    for (const f of this.listeners) f();
  }
  get length() {
    return this.pending.length + (this.current ? 1 : 0);
  }
  enqueue(tasks: AnimationTask[]): Promise<void> {
    this.pending.push(...tasks);
    this.notify();
    if (!this.running) {
      const generation = this.generation;
      this.running = this.drain(generation).finally(() => {
        if (generation === this.generation) {
          this.running = undefined;
          this.current = '';
          this.notify();
        }
      });
    }
    return this.running;
  }
  private async drain(generation: number) {
    while (this.pending.length && generation === this.generation) {
      const task = this.pending.shift()!;
      this.current = task.label;
      this.abort = new AbortController();
      this.notify();
      await task.run(this.abort.signal);
      this.current = '';
      this.notify();
    }
  }
  skip() {
    this.abort?.abort();
  }
  cancel() {
    this.generation++;
    this.pending = [];
    this.abort?.abort();
    this.running = undefined;
    this.current = '';
    this.notify();
  }
  fastForward() {
    this.cancel();
  }
  setPaused(value: boolean) {
    this.paused = value;
    this.notify();
  }
  setSpeed(value: number) {
    this.speed = Math.max(0.25, Math.min(4, value));
    this.notify();
  }
  async tween(duration: number, update: (t: number) => void, signal: AbortSignal): Promise<void> {
    if (signal.aborted) {
      update(1);
      return;
    }
    return new Promise((resolve) => {
      let elapsed = 0,
        last = performance.now(),
        raf = 0;
      let activeMs = 0,
        frames = 0,
        worstMs = 0;
      const end = () => {
        cancelAnimationFrame(raf);
        signal.removeEventListener('abort', end);
        update(1);
        resolve();
      };
      const tick = (now: number) => {
        const active = !this.paused && !document.hidden;
        if (active) {
          const delta = now - last;
          activeMs += delta;
          frames++;
          worstMs = Math.max(worstMs, delta);
          this.frameStats = {
            frames,
            averageFps: activeMs > 0 ? (frames * 1000) / activeMs : 0,
            worstFrameMs: worstMs,
          };
          elapsed += Math.min(40, delta) * this.speed;
        }
        last = now;
        if (!active) {
          raf = requestAnimationFrame(tick);
          return;
        }
        const t = duration <= 0 ? 1 : Math.min(1, elapsed / duration);
        update(t);
        if (t === 1) end();
        else raf = requestAnimationFrame(tick);
      };
      signal.addEventListener('abort', end, { once: true });
      raf = requestAnimationFrame(tick);
    });
  }
}
