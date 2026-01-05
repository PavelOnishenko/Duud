export interface ShapeParams {
  type: string;
  x: number;
  y: number;
  color: string;
  [key: string]: any;
}

export function drawRectangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function drawTriangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x - size, y + size);
  ctx.lineTo(x + size, y + size);
  ctx.closePath();
  ctx.fill();
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
): void {
  const spikes = 5;
  const outerRadius = radius;
  const innerRadius = radius * 0.4;

  ctx.fillStyle = color;
  ctx.beginPath();

  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.closePath();
  ctx.fill();
}

export function drawShape(ctx: CanvasRenderingContext2D, shape: ShapeParams): void {
  switch (shape.type) {
    case 'rectangle':
      drawRectangle(ctx, shape.x, shape.y, shape.width, shape.height, shape.color);
      break;
    case 'circle':
      drawCircle(ctx, shape.x, shape.y, shape.radius, shape.color);
      break;
    case 'triangle':
      drawTriangle(ctx, shape.x, shape.y, shape.size, shape.color);
      break;
    case 'line':
      drawLine(ctx, shape.x, shape.y, shape.x2, shape.y2, shape.color, shape.width);
      break;
    case 'star':
      drawStar(ctx, shape.x, shape.y, shape.radius, shape.color);
      break;
  }
}
