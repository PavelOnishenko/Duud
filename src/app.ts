import { StickFigure, createDefaultStickFigure, StickFigureParams } from './stickFigure.js';
import { Animator, Animation, Keyframe } from './animator.js';
import { getAnimationByName, ANIMATIONS } from './animations.js';

class DuudApp {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private stickFigure: StickFigure;
  private animator: Animator;
  private animationFrameId: number | null = null;
  private selectedAnimation: string = 'Punch';

  // Pose editor state
  private currentKeyframes: Keyframe[] = [];
  private currentAnimationName: string = 'My Animation';
  private poseEditorEnabled: boolean = true;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.canvas.width = 800;
    this.canvas.height = 600;

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context');
    }
    this.ctx = context;

    this.stickFigure = new StickFigure(createDefaultStickFigure(400, 300));
    this.animator = new Animator(this.stickFigure);

    this.initializeUI();
    this.initializePoseEditor();
    this.startRenderLoop();
    this.drawFrame();
  }

  private initializeUI(): void {
    const animationSelect = document.getElementById('animationType') as HTMLSelectElement;
    const playBtn = document.getElementById('playBtn') as HTMLButtonElement;
    const pauseBtn = document.getElementById('pauseBtn') as HTMLButtonElement;
    const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
    const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
    const speedSlider = document.getElementById('speedSlider') as HTMLInputElement;
    const speedValue = document.getElementById('speedValue') as HTMLSpanElement;
    const renderBtn = document.getElementById('renderBtn') as HTMLButtonElement;

    animationSelect.addEventListener('change', (e) => {
      this.selectedAnimation = (e.target as HTMLSelectElement).value;
    });

    playBtn.addEventListener('click', () => {
      this.playAnimation();
      this.poseEditorEnabled = false;
    });

    pauseBtn.addEventListener('click', () => {
      this.animator.pause();
    });

    stopBtn.addEventListener('click', () => {
      this.animator.stop();
      this.poseEditorEnabled = true;
      this.drawFrame();
      this.updatePoseEditorFromStickFigure();
    });

    resetBtn.addEventListener('click', () => {
      this.animator.reset();
      this.drawFrame();
    });

    speedSlider.addEventListener('input', (e) => {
      const speed = parseFloat((e.target as HTMLInputElement).value);
      this.animator.setSpeed(speed);
      speedValue.textContent = `${speed.toFixed(1)}x`;
    });

    renderBtn.addEventListener('click', () => {
      this.renderSpriteSheet();
    });
  }

  private initializePoseEditor(): void {
    // Joint angle sliders
    const sliders = [
      { id: 'headTilt', param: 'headTilt', valueId: 'headTiltValue' },
      { id: 'torsoAngle', param: 'torsoAngle', valueId: 'torsoAngleValue' },
      { id: 'leftShoulder', param: 'leftShoulderAngle', valueId: 'leftShoulderValue' },
      { id: 'leftElbow', param: 'leftElbowAngle', valueId: 'leftElbowValue' },
      { id: 'rightShoulder', param: 'rightShoulderAngle', valueId: 'rightShoulderValue' },
      { id: 'rightElbow', param: 'rightElbowAngle', valueId: 'rightElbowValue' },
      { id: 'leftHip', param: 'leftHipAngle', valueId: 'leftHipValue' },
      { id: 'leftKnee', param: 'leftKneeAngle', valueId: 'leftKneeValue' },
      { id: 'rightHip', param: 'rightHipAngle', valueId: 'rightHipValue' },
      { id: 'rightKnee', param: 'rightKneeAngle', valueId: 'rightKneeValue' }
    ];

    sliders.forEach(({ id, param, valueId }) => {
      const slider = document.getElementById(id) as HTMLInputElement;
      const valueDisplay = document.getElementById(valueId) as HTMLSpanElement;

      slider.addEventListener('input', () => {
        if (this.poseEditorEnabled) {
          const value = parseFloat(slider.value);
          valueDisplay.textContent = value.toFixed(2);
          this.stickFigure.setParams({ [param]: value } as Partial<StickFigureParams>);
          this.drawFrame();
        }
      });
    });

    // Animation controls
    const addKeyframeBtn = document.getElementById('addKeyframeBtn') as HTMLButtonElement;
    const newAnimationBtn = document.getElementById('newAnimationBtn') as HTMLButtonElement;
    const saveAnimationBtn = document.getElementById('saveAnimationBtn') as HTMLButtonElement;

    addKeyframeBtn.addEventListener('click', () => this.addKeyframe());
    newAnimationBtn.addEventListener('click', () => this.createNewAnimation());
    saveAnimationBtn.addEventListener('click', () => this.saveAnimation());
  }

  private updatePoseEditorFromStickFigure(): void {
    const params = this.stickFigure.getParams();
    const updates = [
      { id: 'headTilt', value: params.headTilt, valueId: 'headTiltValue' },
      { id: 'torsoAngle', value: params.torsoAngle, valueId: 'torsoAngleValue' },
      { id: 'leftShoulder', value: params.leftShoulderAngle, valueId: 'leftShoulderValue' },
      { id: 'leftElbow', value: params.leftElbowAngle, valueId: 'leftElbowValue' },
      { id: 'rightShoulder', value: params.rightShoulderAngle, valueId: 'rightShoulderValue' },
      { id: 'rightElbow', value: params.rightElbowAngle, valueId: 'rightElbowValue' },
      { id: 'leftHip', value: params.leftHipAngle, valueId: 'leftHipValue' },
      { id: 'leftKnee', value: params.leftKneeAngle, valueId: 'leftKneeValue' },
      { id: 'rightHip', value: params.rightHipAngle, valueId: 'rightHipValue' },
      { id: 'rightKnee', value: params.rightKneeAngle, valueId: 'rightKneeValue' }
    ];

    updates.forEach(({ id, value, valueId }) => {
      const slider = document.getElementById(id) as HTMLInputElement;
      const valueDisplay = document.getElementById(valueId) as HTMLSpanElement;
      slider.value = value.toString();
      valueDisplay.textContent = value.toFixed(2);
    });
  }

  private addKeyframe(): void {
    const timeInput = document.getElementById('keyframeTime') as HTMLInputElement;
    const time = parseFloat(timeInput.value) || 0;

    const params = this.stickFigure.getParams();
    const keyframe: Keyframe = {
      time,
      params: {
        headTilt: params.headTilt,
        torsoAngle: params.torsoAngle,
        leftShoulderAngle: params.leftShoulderAngle,
        leftElbowAngle: params.leftElbowAngle,
        rightShoulderAngle: params.rightShoulderAngle,
        rightElbowAngle: params.rightElbowAngle,
        leftHipAngle: params.leftHipAngle,
        leftKneeAngle: params.leftKneeAngle,
        rightHipAngle: params.rightHipAngle,
        rightKneeAngle: params.rightKneeAngle
      }
    };

    // Add or update keyframe
    const existingIndex = this.currentKeyframes.findIndex(kf => kf.time === time);
    if (existingIndex >= 0) {
      this.currentKeyframes[existingIndex] = keyframe;
    } else {
      this.currentKeyframes.push(keyframe);
      this.currentKeyframes.sort((a, b) => a.time - b.time);
    }

    this.updateKeyframeList();
  }

  public deleteKeyframe(time: number): void {
    this.currentKeyframes = this.currentKeyframes.filter(kf => kf.time !== time);
    this.updateKeyframeList();
  }

  private updateKeyframeList(): void {
    const keyframeList = document.getElementById('keyframeList') as HTMLDivElement;

    if (this.currentKeyframes.length === 0) {
      keyframeList.innerHTML = '<div style="color: #858585; font-size: 12px; padding: 5px;">No keyframes added yet</div>';
      return;
    }

    keyframeList.innerHTML = this.currentKeyframes.map(kf => `
      <div class="keyframe-item">
        <span class="time">${kf.time.toFixed(2)}s</span>
        <button onclick="window.duudApp.deleteKeyframe(${kf.time})">Delete</button>
      </div>
    `).join('');
  }

  private createNewAnimation(): void {
    const name = prompt('Enter animation name:', 'My Animation');
    if (name) {
      this.currentAnimationName = name;
      this.currentKeyframes = [];
      this.updateKeyframeList();
      alert(`New animation "${name}" created! Start adding keyframes.`);
    }
  }

  private saveAnimation(): void {
    if (this.currentKeyframes.length === 0) {
      alert('Please add at least one keyframe before saving.');
      return;
    }

    const duration = Math.max(...this.currentKeyframes.map(kf => kf.time));
    const animation: Animation = {
      name: this.currentAnimationName,
      duration,
      keyframes: this.currentKeyframes,
      loop: confirm('Should this animation loop?')
    };

    // Add to animations list
    const animationSelect = document.getElementById('animationType') as HTMLSelectElement;
    const option = document.createElement('option');
    option.value = animation.name;
    option.textContent = animation.name;
    animationSelect.appendChild(option);

    // Store in ANIMATIONS array
    ANIMATIONS.push(animation);

    alert(`Animation "${animation.name}" saved successfully!`);
  }

  private playAnimation(): void {
    const animation = getAnimationByName(this.selectedAnimation);
    if (animation) {
      this.animator.play(animation);
    }
  }

  private startRenderLoop(): void {
    const render = () => {
      this.animator.tick();
      this.drawFrame();
      this.animationFrameId = requestAnimationFrame(render);
    };
    render();
  }

  private drawFrame(): void {
    // Clear canvas
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw stick figure
    this.stickFigure.draw(this.ctx);
  }

  private renderSpriteSheet(): void {
    const animation = getAnimationByName(this.selectedAnimation);
    if (!animation) {
      alert('Please select an animation to render.');
      return;
    }

    // Get frame count from user
    const framesInput = prompt('How many frames to render?', '10');
    const frameCount = parseInt(framesInput || '10');

    if (frameCount <= 0 || frameCount > 100) {
      alert('Please enter a valid frame count (1-100).');
      return;
    }

    // Calculate sprite sheet dimensions
    const frameWidth = this.canvas.width;
    const frameHeight = this.canvas.height;
    const cols = Math.ceil(Math.sqrt(frameCount));
    const rows = Math.ceil(frameCount / cols);

    const spriteSheetWidth = frameWidth * cols;
    const spriteSheetHeight = frameHeight * rows;

    // Create offscreen canvas for sprite sheet
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = spriteSheetWidth;
    spriteCanvas.height = spriteSheetHeight;
    const spriteCtx = spriteCanvas.getContext('2d')!;

    // Fill background
    spriteCtx.fillStyle = '#ffffff';
    spriteCtx.fillRect(0, 0, spriteSheetWidth, spriteSheetHeight);

    // Save current state
    const originalParams = this.stickFigure.getParams();
    const wasPlaying = this.animator.isAnimating();
    this.animator.stop();

    // Render each frame
    for (let i = 0; i < frameCount; i++) {
      const time = (i / (frameCount - 1)) * animation.duration;
      const col = i % cols;
      const row = Math.floor(i / cols);

      // Manually interpolate pose at this time
      this.interpolatePoseAtTime(animation, time);

      // Draw frame on main canvas
      this.drawFrame();

      // Copy to sprite sheet
      spriteCtx.drawImage(
        this.canvas,
        col * frameWidth,
        row * frameHeight,
        frameWidth,
        frameHeight
      );
    }

    // Restore state
    this.stickFigure.setParams(originalParams);
    this.drawFrame();
    if (wasPlaying) {
      this.animator.resume();
    }

    // Download sprite sheet
    spriteCanvas.toBlob((blob) => {
      if (!blob) {
        alert('Failed to generate sprite sheet');
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const animName = animation.name.replace(/\s+/g, '-').toLowerCase();
      link.download = `${animName}-spritesheet-${frameCount}frames-${timestamp}.png`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);

      alert(`Sprite sheet rendered with ${frameCount} frames!\nDimensions: ${spriteSheetWidth}x${spriteSheetHeight}px\nGrid: ${cols}x${rows}`);
    }, 'image/png');
  }

  private interpolatePoseAtTime(animation: Animation, time: number): void {
    const keyframes = animation.keyframes;
    if (keyframes.length === 0) return;

    // Find surrounding keyframes
    let prevKeyframe = keyframes[0];
    let nextKeyframe = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (time >= keyframes[i].time && time <= keyframes[i + 1].time) {
        prevKeyframe = keyframes[i];
        nextKeyframe = keyframes[i + 1];
        break;
      }
    }

    // Handle edge cases
    if (time <= keyframes[0].time) {
      this.stickFigure.setParams(keyframes[0].params);
      return;
    }

    if (time >= keyframes[keyframes.length - 1].time) {
      this.stickFigure.setParams(keyframes[keyframes.length - 1].params);
      return;
    }

    // Interpolate
    const t = (time - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
    const interpolated: Partial<StickFigureParams> = {};

    const keys = new Set([
      ...Object.keys(prevKeyframe.params),
      ...Object.keys(nextKeyframe.params)
    ]);

    for (const key of keys) {
      const startValue = (prevKeyframe.params as any)[key];
      const endValue = (nextKeyframe.params as any)[key];

      if (typeof startValue === 'number' && typeof endValue === 'number') {
        (interpolated as any)[key] = startValue + (endValue - startValue) * t;
      }
    }

    this.stickFigure.setParams(interpolated);
  }
}

// Make app globally accessible for inline event handlers
declare global {
  interface Window {
    duudApp: DuudApp;
  }
}

const app = new DuudApp();
window.duudApp = app;
