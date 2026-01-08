import { CanvasManager } from './canvas.js';
import { CodeGenerator } from './codeGenerator.js';
import { ShapeParams } from './shapes.js';

class DuudApp {
  private canvasManager: CanvasManager;
  private codeGenerator: CodeGenerator;
  private selectedShape: string = 'circle';
  private selectedColor: string = '#4ec9b0';
  private selectedSize: number = 50;
  private lineLength: number = 100;
  private lineAngle: number = 0;
  private lineWidth: number = 3;
  private previewX: number = 0;
  private previewY: number = 0;
  private showPreview: boolean = false;

  constructor() {
    this.canvasManager = new CanvasManager('canvas', 800, 600);
    this.codeGenerator = new CodeGenerator();
    this.initializeUI();
  }

  private initializeUI(): void {
    const shapeSelect = document.getElementById('shapeType') as HTMLSelectElement;
    const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;
    const sizeParam = document.getElementById('sizeParam') as HTMLInputElement;
    const lineParams = document.getElementById('lineParams') as HTMLDivElement;
    const lineLengthInput = document.getElementById('lineLength') as HTMLInputElement;
    const lineAngleInput = document.getElementById('lineAngle') as HTMLInputElement;
    const lineWidthInput = document.getElementById('lineWidth') as HTMLInputElement;
    const canvas = this.canvasManager.getCanvas();
    const renderBtn = document.getElementById('renderBtn') as HTMLButtonElement;
    const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;

    shapeSelect.addEventListener('change', (e) => {
      this.selectedShape = (e.target as HTMLSelectElement).value;
      this.toggleLineParams();
    });

    colorPicker.addEventListener('change', (e) => {
      this.selectedColor = (e.target as HTMLInputElement).value;
    });

    sizeParam.addEventListener('input', (e) => {
      this.selectedSize = parseInt((e.target as HTMLInputElement).value);
    });

    lineLengthInput.addEventListener('input', (e) => {
      this.lineLength = parseInt((e.target as HTMLInputElement).value);
    });

    lineAngleInput.addEventListener('input', (e) => {
      this.lineAngle = parseInt((e.target as HTMLInputElement).value);
    });

    lineWidthInput.addEventListener('input', (e) => {
      this.lineWidth = parseInt((e.target as HTMLInputElement).value);
    });

    canvas.addEventListener('click', (e) => {
      this.handleCanvasClick(e);
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

    clearBtn.addEventListener('click', () => {
      this.clearCanvas();
    });
  }

  private toggleLineParams(): void {
    const lineParams = document.getElementById('lineParams') as HTMLDivElement;
    const sizeParam = document.getElementById('sizeParam')?.parentElement as HTMLDivElement;

    if (this.selectedShape === 'line') {
      lineParams.style.display = 'flex';
      if (sizeParam) sizeParam.style.display = 'none';
    } else {
      lineParams.style.display = 'none';
      if (sizeParam) sizeParam.style.display = 'flex';
    }
  }

  private handleCanvasClick(event: MouseEvent): void {
    const rect = this.canvasManager.getCanvas().getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const shape = this.createShape(x, y);
    this.canvasManager.addShape(shape);
    this.updateCodeDisplay();
  }

  private handleCanvasMouseMove(event: MouseEvent): void {
    const rect = this.canvasManager.getCanvas().getBoundingClientRect();
    this.previewX = event.clientX - rect.left;
    this.previewY = event.clientY - rect.top;

    if (this.showPreview) {
      this.canvasManager.redraw();
      this.drawPreview();
    }
  }

  private drawPreview(): void {
    const ctx = this.canvasManager.getContext();
    ctx.save();
    ctx.globalAlpha = 0.4;

    const previewShape = this.createShape(this.previewX, this.previewY);
    this.drawShapePreview(ctx, previewShape);

    ctx.restore();
  }

  private drawShapePreview(ctx: CanvasRenderingContext2D, shape: ShapeParams): void {
    ctx.fillStyle = shape.color;
    ctx.strokeStyle = shape.color;

    switch (shape.type) {
      case 'rectangle':
        ctx.fillRect(shape.x - shape.width / 2, shape.y - shape.height / 2, shape.width, shape.height);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y - shape.size);
        ctx.lineTo(shape.x - shape.size, shape.y + shape.size);
        ctx.lineTo(shape.x + shape.size, shape.y + shape.size);
        ctx.closePath();
        ctx.fill();
        break;
      case 'star':
        const spikes = 5;
        const outerRadius = shape.radius;
        const innerRadius = shape.radius * 0.4;
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const angle = (i * Math.PI) / spikes - Math.PI / 2;
          const r = i % 2 === 0 ? outerRadius : innerRadius;
          const px = shape.x + r * Math.cos(angle);
          const py = shape.y + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        break;
      case 'line':
        ctx.lineWidth = shape.lineWidth;
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
        break;
    }
  }

  private createShape(x: number, y: number): ShapeParams {
    const baseShape: ShapeParams = {
      type: this.selectedShape,
      x: Math.round(x),
      y: Math.round(y),
      color: this.selectedColor,
    };

    switch (this.selectedShape) {
      case 'rectangle':
        return {
          ...baseShape,
          width: this.selectedSize,
          height: this.selectedSize
        };
      case 'circle':
        return {
          ...baseShape,
          radius: this.selectedSize
        };
      case 'triangle':
        return {
          ...baseShape,
          size: this.selectedSize
        };
      case 'star':
        return {
          ...baseShape,
          radius: this.selectedSize
        };
      case 'line':
        const angleRad = (this.lineAngle * Math.PI) / 180;
        const x2 = Math.round(x + this.lineLength * Math.cos(angleRad));
        const y2 = Math.round(y + this.lineLength * Math.sin(angleRad));
        return {
          ...baseShape,
          x2,
          y2,
          lineWidth: this.lineWidth,
          length: this.lineLength,
          angle: this.lineAngle
        };
      default:
        return baseShape;
    }
  }

  private updateCodeDisplay(): void {
    const shapes = this.canvasManager.getShapes();
    const code = this.codeGenerator.generateCode(shapes);
    const codeDisplay = document.getElementById('codeDisplay') as HTMLElement;
    codeDisplay.textContent = code;
  }

  private renderPNG(): void {
    const canvas = this.canvasManager.getCanvas();

    canvas.toBlob((blob) => {
      if (!blob) {
        alert('Failed to generate PNG');
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `duud-sprite-${timestamp}.png`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  private clearCanvas(): void {
    this.canvasManager.clearShapes();
    this.updateCodeDisplay();
  }
}

new DuudApp();
