import { CanvasManager } from './canvas.js';
import { CodeGenerator } from './codeGenerator.js';
import { ShapeParams } from './shapes.js';

class DuudApp {
  private canvasManager: CanvasManager;
  private codeGenerator: CodeGenerator;
  private selectedShape: string = 'circle';
  private selectedColor: string = '#4ec9b0';

  constructor() {
    this.canvasManager = new CanvasManager('canvas', 800, 600);
    this.codeGenerator = new CodeGenerator();
    this.initializeUI();
  }

  private initializeUI(): void {
    const shapeSelect = document.getElementById('shapeType') as HTMLSelectElement;
    const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;
    const canvas = this.canvasManager.getCanvas();
    const renderBtn = document.getElementById('renderBtn') as HTMLButtonElement;
    const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;

    shapeSelect.addEventListener('change', (e) => {
      this.selectedShape = (e.target as HTMLSelectElement).value;
    });

    colorPicker.addEventListener('change', (e) => {
      this.selectedColor = (e.target as HTMLInputElement).value;
    });

    canvas.addEventListener('click', (e) => {
      this.handleCanvasClick(e);
    });

    renderBtn.addEventListener('click', () => {
      this.renderPNG();
    });

    clearBtn.addEventListener('click', () => {
      this.clearCanvas();
    });
  }

  private handleCanvasClick(event: MouseEvent): void {
    const rect = this.canvasManager.getCanvas().getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const shape = this.createShape(x, y);
    this.canvasManager.addShape(shape);
    this.updateCodeDisplay();
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
        return { ...baseShape, width: 60, height: 40 };
      case 'circle':
        return { ...baseShape, radius: 30 };
      case 'triangle':
        return { ...baseShape, size: 30 };
      case 'star':
        return { ...baseShape, radius: 35 };
      case 'line':
        return { ...baseShape, x2: x + 50, y2: y + 50, width: 3 };
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
