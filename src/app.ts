import { StickFigure, createDefaultStickFigure, StickFigureParams } from './stickFigure.js';
import { Animator, Animation, Keyframe } from './animator.js';
import { getAnimationByName, ANIMATIONS } from './animations.js';

class DuudApp {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private stickFigure: StickFigure;
  private animator: Animator;
  private animationFrameId: number | null = null;
  private selectedAnimation: string = '';

  // Pose editor state
  private currentKeyframes: Keyframe[] = [];
  private currentAnimationName: string = 'My Animation';
  private poseEditorEnabled: boolean = true;
  private selectedKeyframeTime: number | null = null;

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

    this.loadSavedAnimations();
    this.initializeUI();
    this.initializePoseEditor();
    this.loadSelectedAnimation();
    this.startRenderLoop();
    this.drawFrame();
  }

  private loadSavedAnimations(): void {
    try {
      const saved = localStorage.getItem('duud_animations');
      if (saved) {
        const savedAnimations: Animation[] = JSON.parse(saved);
        savedAnimations.forEach(anim => {
          if (!ANIMATIONS.find(a => a.name === anim.name)) {
            ANIMATIONS.push(anim);
          }
        });
      }
      // Set initial selection to first animation if available
      if (ANIMATIONS.length > 0) {
        this.selectedAnimation = ANIMATIONS[0].name;
      }
    } catch (e) {
      console.error('Failed to load saved animations:', e);
    }
  }

  private saveAnimationsToStorage(): void {
    try {
      // Save all animations to localStorage
      const animationsToSave = ANIMATIONS.map(anim => ({
        name: anim.name,
        duration: anim.duration,
        loop: anim.loop,
        keyframes: anim.keyframes
      }));
      localStorage.setItem('duud_animations', JSON.stringify(animationsToSave));
    } catch (e) {
      console.error('Failed to save animations:', e);
    }
  }

  private populateAnimationDropdown(): void {
    const animationSelect = document.getElementById('animationType') as HTMLSelectElement;
    animationSelect.innerHTML = '';

    if (ANIMATIONS.length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = '(No animations)';
      option.disabled = true;
      option.selected = true;
      animationSelect.appendChild(option);
      return;
    }

    ANIMATIONS.forEach(anim => {
      const option = document.createElement('option');
      option.value = anim.name;
      option.textContent = anim.name;
      if (anim.name === this.selectedAnimation) {
        option.selected = true;
      }
      animationSelect.appendChild(option);
    });
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

    // Populate animation dropdown with all animations
    this.populateAnimationDropdown();

    animationSelect.addEventListener('change', (e) => {
      this.selectedAnimation = (e.target as HTMLSelectElement).value;
      this.loadSelectedAnimation();
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

    const exportTsBtn = document.getElementById('exportTsBtn') as HTMLButtonElement;
    exportTsBtn.addEventListener('click', () => {
      this.exportToTypeScript();
    });

    const deleteAnimationBtn = document.getElementById('deleteAnimationBtn') as HTMLButtonElement;
    deleteAnimationBtn.addEventListener('click', () => {
      this.deleteSelectedAnimation();
    });
  }

  private deleteSelectedAnimation(): void {
    if (!this.selectedAnimation) {
      alert('No animation selected to delete.');
      return;
    }

    if (!confirm(`Delete animation "${this.selectedAnimation}"?`)) {
      return;
    }

    const index = ANIMATIONS.findIndex(a => a.name === this.selectedAnimation);
    if (index >= 0) {
      ANIMATIONS.splice(index, 1);
      this.saveAnimationsToStorage();
      this.populateAnimationDropdown();

      // Select first remaining animation or clear selection
      if (ANIMATIONS.length > 0) {
        this.selectedAnimation = ANIMATIONS[0].name;
        const animationSelect = document.getElementById('animationType') as HTMLSelectElement;
        animationSelect.value = this.selectedAnimation;
        this.loadSelectedAnimation();
      } else {
        this.selectedAnimation = '';
        this.currentKeyframes = [];
        this.currentAnimationName = 'My Animation';
        this.updateKeyframeList();
      }
    }
  }

  private initializePoseEditor(): void {
    const defaultFormat = (value: number): string => value.toFixed(2);

    // Joint angle sliders
    const sliders = [
      { id: 'bodyX', param: 'x', valueId: 'bodyXValue', format: (value: number) => value.toFixed(0) },
      { id: 'bodyY', param: 'y', valueId: 'bodyYValue', format: (value: number) => value.toFixed(0) },
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

    sliders.forEach(({ id, param, valueId, format }) => {
      const slider = document.getElementById(id) as HTMLInputElement;
      const valueDisplay = document.getElementById(valueId) as HTMLSpanElement;
      const formatValue = format ?? defaultFormat;

      slider.addEventListener('input', () => {
        if (this.poseEditorEnabled) {
          const value = parseFloat(slider.value);
          valueDisplay.textContent = formatValue(value);
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

  private normalizeKeyframes(
    keyframes: Keyframe[],
    fallbackParams: StickFigureParams
  ): Keyframe[] {
    const sorted = [...keyframes].sort((a, b) => a.time - b.time);
    let lastX = fallbackParams.x;
    let lastY = fallbackParams.y;

    return sorted.map((keyframe) => {
      const params = { ...keyframe.params };

      if (typeof params.x !== 'number') {
        params.x = lastX;
      }

      if (typeof params.y !== 'number') {
        params.y = lastY;
      }

      lastX = params.x;
      lastY = params.y;

      return { ...keyframe, params };
    });
  }

  private updatePoseEditorFromStickFigure(): void {
    const params = this.stickFigure.getParams();
    const updates = [
      { id: 'bodyX', value: params.x, valueId: 'bodyXValue', format: (value: number) => value.toFixed(0) },
      { id: 'bodyY', value: params.y, valueId: 'bodyYValue', format: (value: number) => value.toFixed(0) },
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

    updates.forEach(({ id, value, valueId, format }) => {
      const slider = document.getElementById(id) as HTMLInputElement;
      const valueDisplay = document.getElementById(valueId) as HTMLSpanElement;
      const formatValue = format ?? ((num: number) => num.toFixed(2));
      slider.value = value.toString();
      valueDisplay.textContent = formatValue(value);
    });
  }

  private loadSelectedAnimation(): void {
    if (!this.selectedAnimation) {
      this.currentKeyframes = [];
      this.currentAnimationName = 'My Animation';
      this.selectedKeyframeTime = null;
      this.updateKeyframeList();
      return;
    }

    const animation = getAnimationByName(this.selectedAnimation);
    if (animation) {
      this.currentAnimationName = animation.name;
      const fallbackParams = this.stickFigure.getParams();
      this.currentKeyframes = this.normalizeKeyframes(animation.keyframes, fallbackParams);
      this.selectedKeyframeTime = null;
      this.updateKeyframeList();
    }
  }

  private addKeyframe(): void {
    const timeInput = document.getElementById('keyframeTime') as HTMLInputElement;
    const time = parseFloat(timeInput.value) || 0;

    const params = this.stickFigure.getParams();
    const keyframe: Keyframe = {
      time,
      params: {
        x: params.x,
        y: params.y,
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

    // Select the newly added/updated keyframe
    this.selectedKeyframeTime = time;

    this.updateKeyframeList();
  }

  public deleteKeyframe(time: number): void {
    this.currentKeyframes = this.currentKeyframes.filter(kf => kf.time !== time);

    // Clear selection if deleted keyframe was selected
    if (this.selectedKeyframeTime === time) {
      this.selectedKeyframeTime = null;
    }

    this.updateKeyframeList();
  }

  public loadKeyframeIntoPose(time: number): void {
    const keyframe = this.currentKeyframes.find(kf => kf.time === time);
    if (keyframe) {
      // Update the stick figure with keyframe params
      this.stickFigure.setParams(keyframe.params);
      this.updatePoseEditorFromStickFigure();
      this.drawFrame();

      // Track the selected keyframe
      this.selectedKeyframeTime = time;

      // Update the time input to match selected keyframe
      const timeInput = document.getElementById('keyframeTime') as HTMLInputElement;
      timeInput.value = time.toString();

      // Refresh timeline to show selection
      this.updateKeyframeList();
    }
  }

  private updateKeyframeList(): void {
    const timelineContainer = document.getElementById('timelineContainer') as HTMLDivElement;

    if (this.currentKeyframes.length === 0) {
      timelineContainer.innerHTML = '<div class="timeline-empty">No keyframes added yet</div>';
      return;
    }

    // Calculate duration (max time + some padding, minimum 1 second)
    const maxTime = Math.max(...this.currentKeyframes.map(kf => kf.time));
    const duration = Math.max(1, Math.ceil(maxTime * 1.2)); // Add 20% padding

    // Generate time scale markers
    const numMarkers = Math.min(duration + 1, 11); // Max 11 markers (0-10)
    const markerStep = duration / (numMarkers - 1);
    const scaleMarkers = Array.from({ length: numMarkers }, (_, i) =>
      (i * markerStep).toFixed(1) + 's'
    );

    // Generate tick marks (10 ticks)
    const ticks = Array.from({ length: 10 }, (_, i) =>
      `<div class="timeline-tick${i % 5 === 0 ? ' major' : ''}"></div>`
    ).join('');

    // Generate keyframe dots
    const dots = this.currentKeyframes.map(kf => {
      const position = (kf.time / duration) * 100;
      const isSelected = this.selectedKeyframeTime === kf.time;
      return `
        <div class="keyframe-dot${isSelected ? ' selected' : ''}"
             style="left: ${position}%"
             onclick="window.duudApp.loadKeyframeIntoPose(${kf.time})">
          <div class="keyframe-tooltip">
            <span class="time">${kf.time.toFixed(2)}s</span>
            <span class="delete-btn" onclick="event.stopPropagation(); window.duudApp.deleteKeyframe(${kf.time})">Delete</span>
          </div>
        </div>
      `;
    }).join('');

    timelineContainer.innerHTML = `
      <div class="timeline-scale">
        ${scaleMarkers.map(m => `<span>${m}</span>`).join('')}
      </div>
      <div class="timeline-track">
        <div class="timeline-ruler">${ticks}</div>
        ${dots}
      </div>
      <div class="timeline-duration">
        <span>Keyframes: <span class="duration-value">${this.currentKeyframes.length}</span></span>
        <span>Duration: <span class="duration-value">${maxTime.toFixed(2)}s</span></span>
      </div>
    `;
  }

  private createNewAnimation(): void {
    const name = prompt('Enter animation name:', 'My Animation');
    if (name) {
      this.currentAnimationName = name;
      const currentParams = this.stickFigure.getParams();
      const defaultParams = createDefaultStickFigure(currentParams.x, currentParams.y);
      this.stickFigure.setParams(defaultParams);
      this.updatePoseEditorFromStickFigure();
      this.drawFrame();

      const defaultKeyframe: Keyframe = {
        time: 0,
        params: {
          x: defaultParams.x,
          y: defaultParams.y,
          headTilt: defaultParams.headTilt,
          torsoAngle: defaultParams.torsoAngle,
          leftShoulderAngle: defaultParams.leftShoulderAngle,
          leftElbowAngle: defaultParams.leftElbowAngle,
          rightShoulderAngle: defaultParams.rightShoulderAngle,
          rightElbowAngle: defaultParams.rightElbowAngle,
          leftHipAngle: defaultParams.leftHipAngle,
          leftKneeAngle: defaultParams.leftKneeAngle,
          rightHipAngle: defaultParams.rightHipAngle,
          rightKneeAngle: defaultParams.rightKneeAngle
        }
      };

      this.currentKeyframes = [defaultKeyframe];
      this.selectedKeyframeTime = 0;
      const timeInput = document.getElementById('keyframeTime') as HTMLInputElement;
      timeInput.value = '0';
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

    // Check if animation with this name already exists
    const existingIndex = ANIMATIONS.findIndex(a => a.name === animation.name);
    if (existingIndex >= 0) {
      // Update existing animation
      ANIMATIONS[existingIndex] = animation;
    } else {
      // Add new animation
      ANIMATIONS.push(animation);
    }

    // Save to localStorage
    this.saveAnimationsToStorage();

    // Refresh dropdown
    this.populateAnimationDropdown();

    // Select the saved animation
    this.selectedAnimation = animation.name;
    const animationSelect = document.getElementById('animationType') as HTMLSelectElement;
    animationSelect.value = animation.name;

    alert(`Animation "${animation.name}" saved successfully!`);
  }

  private playAnimation(): void {
    if (
      !this.animator.isAnimating() &&
      this.animator.getCurrentAnimation() &&
      this.animator.getCurrentTime() > 0
    ) {
      const currentAnimation = this.animator.getCurrentAnimation();
      const targetName =
        this.currentKeyframes.length === 0
          ? this.selectedAnimation
          : this.currentAnimationName;
      if (currentAnimation?.name === targetName) {
        this.animator.resume();
        return;
      }
    }

    if (this.currentKeyframes.length === 0) {
      const animation = getAnimationByName(this.selectedAnimation);
      if (animation) {
        this.animator.play(animation);
        return;
      }

      alert('Please add at least one keyframe to play.');
      return;
    }

    const sortedKeyframes = [...this.currentKeyframes].sort((a, b) => a.time - b.time);
    const maxTime = Math.max(...sortedKeyframes.map(kf => kf.time));
    const selectedAnimation = getAnimationByName(this.selectedAnimation);
    const animation: Animation = {
      name: this.currentAnimationName,
      duration: maxTime,
      keyframes: sortedKeyframes,
      loop: selectedAnimation?.loop ?? false
    };

    this.animator.play(animation);
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

  private exportToTypeScript(): void {
    const animation = getAnimationByName(this.selectedAnimation);
    if (!animation) {
      alert('Please select an animation to export.');
      return;
    }

    // Convert number to readable format (using Math.PI where appropriate)
    const formatNumber = (value: number): string => {
      // Check for common PI fractions
      const piRatios = [
        { ratio: 1, label: 'Math.PI' },
        { ratio: 1/2, label: 'Math.PI / 2' },
        { ratio: 1/3, label: 'Math.PI / 3' },
        { ratio: 1/4, label: 'Math.PI / 4' },
        { ratio: 1/5, label: 'Math.PI / 5' },
        { ratio: 1/6, label: 'Math.PI / 6' },
        { ratio: 1/8, label: 'Math.PI / 8' },
        { ratio: 1/10, label: 'Math.PI / 10' },
        { ratio: 1/12, label: 'Math.PI / 12' },
        { ratio: 1/16, label: 'Math.PI / 16' },
        { ratio: 2/3, label: '2 * Math.PI / 3' },
        { ratio: 3/4, label: '3 * Math.PI / 4' },
        { ratio: 1/1.2, label: 'Math.PI / 1.2' },
        { ratio: 1/1.5, label: 'Math.PI / 1.5' },
        { ratio: 1/2.2, label: 'Math.PI / 2.2' },
        { ratio: 1/2.5, label: 'Math.PI / 2.5' },
      ];

      const absValue = Math.abs(value);
      const sign = value < 0 ? '-' : '';

      for (const { ratio, label } of piRatios) {
        if (Math.abs(absValue - Math.PI * ratio) < 0.0001) {
          return sign + label;
        }
      }

      // For other values, just use the number
      return value.toString();
    };

    // Generate keyframe params code
    const generateParams = (params: Partial<StickFigureParams>): string => {
      const lines: string[] = [];
      for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'number') {
          lines.push(`        ${key}: ${formatNumber(value)}`);
        }
      }
      return lines.join(',\n');
    };

    // Generate keyframes code
    const keyframesCode = animation.keyframes.map(kf => {
      return `    {
      time: ${kf.time},
      params: {
${generateParams(kf.params)}
      }
    }`;
    }).join(',\n');

    // Generate the constant name from animation name
    const constName = animation.name
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '') + '_ANIMATION';

    // Generate full TypeScript code
    const tsCode = `import { Animation } from './animator.js';

export const ${constName}: Animation = {
  name: '${animation.name}',
  duration: ${animation.duration},
  loop: ${animation.loop},
  keyframes: [
${keyframesCode}
  ]
};
`;

    // Download the file
    const blob = new Blob([tsCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const animName = animation.name.replace(/\s+/g, '-').toLowerCase();
    link.download = `${animName}-animation-${timestamp}.ts`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
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
