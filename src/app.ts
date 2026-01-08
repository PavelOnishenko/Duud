import { StickFigure, createDefaultStickFigure } from './stickFigure.js';
import { Animator } from './animator.js';
import { getAnimationByName, ANIMATIONS } from './animations.js';

class DuudApp {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private stickFigure: StickFigure;
  private animator: Animator;
  private animationFrameId: number | null = null;
  private selectedAnimation: string = 'Punch';

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
    });

    pauseBtn.addEventListener('click', () => {
      this.animator.pause();
    });

    stopBtn.addEventListener('click', () => {
      this.animator.stop();
      this.drawFrame();
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

    canvas.addEventListener('mousemove', (e) => {
      this.handleCanvasMouseMove(e);
    });

    canvas.addEventListener('mouseenter', () => {
      this.showPreview = true;
    });

    canvas.addEventListener('mouseleave', () => {
      this.showPreview = false;
      this.canvasManager.redraw();
    });

    renderBtn.addEventListener('click', () => {
      this.renderPNG();
    });

    // Initial draw
    this.drawFrame();
  }

  private playAnimation(): void {
    const animation = getAnimationByName(this.selectedAnimation);
    if (animation) {
      this.animator.play(animation);
      this.updateCodeDisplay();
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

    // Update code display if animation is playing
    if (this.animator.isAnimating()) {
      this.updateCodeDisplay();
    }
  }

  private updateCodeDisplay(): void {
    const codeDisplay = document.getElementById('codeDisplay') as HTMLElement;
    const currentAnim = this.animator.getCurrentAnimation();

    if (!currentAnim) {
      codeDisplay.textContent = this.generateStaticCode();
      return;
    }

    let code = `// Animation: ${currentAnim.name}\n`;
    code += `// Time: ${this.animator.getCurrentTime().toFixed(2)}s / ${currentAnim.duration.toFixed(2)}s\n`;
    code += `// Speed: ${this.animator.getSpeed().toFixed(1)}x\n\n`;
    code += this.generateAnimationCode(currentAnim);

    codeDisplay.textContent = code;
  }

  private generateStaticCode(): string {
    const params = this.stickFigure.getParams();
    let code = `// Stick Figure Animation Studio\n\n`;
    code += `const stickFigure = new StickFigure({\n`;
    code += `  x: ${params.x},\n`;
    code += `  y: ${params.y},\n`;
    code += `  scale: ${params.scale},\n`;
    code += `  headTilt: ${params.headTilt.toFixed(3)},\n`;
    code += `  torsoAngle: ${params.torsoAngle.toFixed(3)},\n`;
    code += `  leftShoulderAngle: ${params.leftShoulderAngle.toFixed(3)},\n`;
    code += `  leftElbowAngle: ${params.leftElbowAngle.toFixed(3)},\n`;
    code += `  rightShoulderAngle: ${params.rightShoulderAngle.toFixed(3)},\n`;
    code += `  rightElbowAngle: ${params.rightElbowAngle.toFixed(3)},\n`;
    code += `  leftHipAngle: ${params.leftHipAngle.toFixed(3)},\n`;
    code += `  leftKneeAngle: ${params.leftKneeAngle.toFixed(3)},\n`;
    code += `  rightHipAngle: ${params.rightHipAngle.toFixed(3)},\n`;
    code += `  rightKneeAngle: ${params.rightKneeAngle.toFixed(3)}\n`;
    code += `});\n\n`;
    code += `stickFigure.draw(ctx);`;
    return code;
  }

  private generateAnimationCode(animation: any): string {
    let code = `const animation = {\n`;
    code += `  name: '${animation.name}',\n`;
    code += `  duration: ${animation.duration},\n`;
    code += `  loop: ${animation.loop},\n`;
    code += `  keyframes: [\n`;

    for (const keyframe of animation.keyframes) {
      code += `    {\n`;
      code += `      time: ${keyframe.time},\n`;
      code += `      params: {\n`;
      for (const [key, value] of Object.entries(keyframe.params)) {
        if (typeof value === 'number') {
          code += `        ${key}: ${(value as number).toFixed(3)},\n`;
        } else {
          code += `        ${key}: '${value}',\n`;
        }
      }
      code += `      }\n`;
      code += `    },\n`;
    }

    code += `  ]\n`;
    code += `};\n\n`;
    code += `animator.play(animation);`;

    return code;
  }

  private renderPNG(): void {
    this.canvas.toBlob((blob) => {
      if (!blob) {
        alert('Failed to generate PNG');
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const animName = this.selectedAnimation.replace(/\s+/g, '-').toLowerCase();
      link.download = `stick-figure-${animName}-${timestamp}.png`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
    }, 'image/png');
  }
}

new DuudApp();
