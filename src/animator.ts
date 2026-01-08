import { StickFigure, StickFigureParams } from './stickFigure.js';

export interface Keyframe {
  time: number; // Time in seconds
  params: Partial<StickFigureParams>;
}

export interface Animation {
  name: string;
  duration: number; // Total duration in seconds
  keyframes: Keyframe[];
  loop: boolean;
}

export class Animator {
  private stickFigure: StickFigure;
  private currentAnimation: Animation | null = null;
  private currentTime: number = 0;
  private isPlaying: boolean = false;
  private playbackSpeed: number = 1;
  private lastFrameTime: number = 0;
  private baseParams: StickFigureParams;

  constructor(stickFigure: StickFigure) {
    this.stickFigure = stickFigure;
    this.baseParams = stickFigure.getParams();
  }

  play(animation: Animation): void {
    this.currentAnimation = animation;
    this.currentTime = 0;
    this.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.baseParams = this.stickFigure.getParams();
  }

  pause(): void {
    this.isPlaying = false;
  }

  resume(): void {
    if (this.currentAnimation) {
      this.isPlaying = true;
      this.lastFrameTime = performance.now();
    }
  }

  stop(): void {
    this.isPlaying = false;
    this.currentTime = 0;
    this.currentAnimation = null;
    this.stickFigure.setParams(this.baseParams);
  }

  reset(): void {
    this.currentTime = 0;
    if (this.currentAnimation) {
      this.updatePose();
    }
  }

  setSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.1, Math.min(5, speed));
  }

  getSpeed(): number {
    return this.playbackSpeed;
  }

  isAnimating(): boolean {
    return this.isPlaying;
  }

  getCurrentAnimation(): Animation | null {
    return this.currentAnimation;
  }

  getCurrentTime(): number {
    return this.currentTime;
  }

  update(deltaTime: number): void {
    if (!this.isPlaying || !this.currentAnimation) {
      return;
    }

    this.currentTime += deltaTime * this.playbackSpeed;

    if (this.currentTime >= this.currentAnimation.duration) {
      if (this.currentAnimation.loop) {
        this.currentTime = this.currentTime % this.currentAnimation.duration;
      } else {
        this.currentTime = this.currentAnimation.duration;
        this.isPlaying = false;
      }
    }

    this.updatePose();
  }

  private updatePose(): void {
    if (!this.currentAnimation) {
      return;
    }

    const keyframes = this.currentAnimation.keyframes;
    if (keyframes.length === 0) {
      return;
    }

    // Find the two keyframes to interpolate between
    let prevKeyframe = keyframes[0];
    let nextKeyframe = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (
        this.currentTime >= keyframes[i].time &&
        this.currentTime <= keyframes[i + 1].time
      ) {
        prevKeyframe = keyframes[i];
        nextKeyframe = keyframes[i + 1];
        break;
      }
    }

    // Handle edge cases
    if (this.currentTime <= keyframes[0].time) {
      this.stickFigure.setParams({ ...this.baseParams, ...keyframes[0].params });
      return;
    }

    if (this.currentTime >= keyframes[keyframes.length - 1].time) {
      this.stickFigure.setParams({
        ...this.baseParams,
        ...keyframes[keyframes.length - 1].params
      });
      return;
    }

    // Interpolate between keyframes
    const t =
      (this.currentTime - prevKeyframe.time) /
      (nextKeyframe.time - prevKeyframe.time);

    const interpolatedParams = this.interpolateParams(
      prevKeyframe.params,
      nextKeyframe.params,
      t
    );

    this.stickFigure.setParams({ ...this.baseParams, ...interpolatedParams });
  }

  private interpolateParams(
    start: Partial<StickFigureParams>,
    end: Partial<StickFigureParams>,
    t: number
  ): Partial<StickFigureParams> {
    const result: Partial<StickFigureParams> = {};

    // Get all numeric keys from both objects
    const keys = new Set([...Object.keys(start), ...Object.keys(end)]);

    for (const key of keys) {
      const startValue = (start as any)[key];
      const endValue = (end as any)[key];

      // Only interpolate numeric values
      if (typeof startValue === 'number' && typeof endValue === 'number') {
        (result as any)[key] = this.lerp(startValue, endValue, t);
      } else if (endValue !== undefined) {
        (result as any)[key] = endValue;
      } else if (startValue !== undefined) {
        (result as any)[key] = startValue;
      }
    }

    return result;
  }

  private lerp(start: number, end: number, t: number): number {
    return start + (end - start) * this.easeInOutQuad(t);
  }

  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // Call this in your animation loop
  tick(): void {
    const now = performance.now();
    const deltaTime = (now - this.lastFrameTime) / 1000; // Convert to seconds
    this.lastFrameTime = now;
    this.update(deltaTime);
  }
}
