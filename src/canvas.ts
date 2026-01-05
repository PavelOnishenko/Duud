import { ShapeParams, drawShape } from './shapes.js';

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private shapes: ShapeParams[] = [];

  constructor(canvasId: string, width: number = 800, height: number = 600) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }

    this.canvas.width = width;
    this.canvas.height = height;

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context');
    }
    this.ctx = context;

    this.clear();
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addShape(shape: ShapeParams): void {
    this.shapes.push(shape);
    this.redraw();
  }

  redraw(): void {
    this.clear();
    for (const shape of this.shapes) {
      drawShape(this.ctx, shape);
    }
  }

  getShapes(): ShapeParams[] {
    return [...this.shapes];
  }

  clearShapes(): void {
    this.shapes = [];
    this.clear();
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
