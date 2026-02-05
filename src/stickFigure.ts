export interface StickFigureParams {
  x: number;
  y: number;
  scale: number;

  // Joint angles (in radians)
  headTilt: number;
  neckAngle: number;
  torsoAngle: number;

  // Bone lengths (base units)
  torsoLength: number;
  upperArmLength: number;
  forearmLength: number;
  thighLength: number;
  calfLength: number;

  // Arms
  leftShoulderAngle: number;
  leftElbowAngle: number;
  rightShoulderAngle: number;
  rightElbowAngle: number;

  // Legs
  leftHipAngle: number;
  leftKneeAngle: number;
  rightHipAngle: number;
  rightKneeAngle: number;

  // Colors
  headColor: string;
  bodyColor: string;
  limbColor: string;
  lineWidth: number;
}

export function createDefaultStickFigure(x: number = 400, y: number = 300): StickFigureParams {
  return {
    x,
    y,
    scale: 1,
    headTilt: 0,
    neckAngle: 0,
    torsoAngle: 0,
    torsoLength: 50,
    upperArmLength: 35,
    forearmLength: 30,
    thighLength: 40,
    calfLength: 35,
    leftShoulderAngle: Math.PI / 4,
    leftElbowAngle: Math.PI / 6,
    rightShoulderAngle: -Math.PI / 4,
    rightElbowAngle: -Math.PI / 6,
    leftHipAngle: Math.PI / 8,
    leftKneeAngle: Math.PI / 12,
    rightHipAngle: -Math.PI / 8,
    rightKneeAngle: -Math.PI / 12,
    headColor: '#FFD1A3',
    bodyColor: '#333333',
    limbColor: '#333333',
    lineWidth: 4
  };
}

export class StickFigure {
  private params: StickFigureParams;

  constructor(params: Partial<StickFigureParams> = {}) {
    this.params = { ...createDefaultStickFigure(), ...params };
  }

  getParams(): StickFigureParams {
    return { ...this.params };
  }

  setParams(params: Partial<StickFigureParams>): void {
    this.params = { ...this.params, ...params };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const p = this.params;
    const s = p.scale;

    ctx.save();
    ctx.translate(p.x, p.y);

    // Base measurements (scaled)
    const headRadius = 15 * s;
    const torsoLength = p.torsoLength * s;
    const upperArmLength = p.upperArmLength * s;
    const forearmLength = p.forearmLength * s;
    const thighLength = p.thighLength * s;
    const calfLength = p.calfLength * s;

    // Head
    ctx.fillStyle = p.headColor;
    ctx.strokeStyle = p.bodyColor;
    ctx.lineWidth = p.lineWidth;
    ctx.beginPath();
    ctx.arc(
      headRadius * Math.sin(p.headTilt),
      -torsoLength / 2 - headRadius + headRadius * (1 - Math.cos(p.headTilt)),
      headRadius,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();

    // Torso
    ctx.strokeStyle = p.bodyColor;
    ctx.lineWidth = p.lineWidth;
    ctx.beginPath();
    const torsoEndX = torsoLength * Math.sin(p.torsoAngle);
    const torsoEndY = torsoLength * Math.cos(p.torsoAngle);
    ctx.moveTo(0, -torsoLength / 2);
    ctx.lineTo(torsoEndX, torsoEndY - torsoLength / 2);
    ctx.stroke();

    // Left arm
    this.drawArm(
      ctx,
      0,
      -torsoLength / 2 + 5 * s,
      p.leftShoulderAngle,
      p.leftElbowAngle,
      upperArmLength,
      forearmLength,
      p.limbColor,
      p.lineWidth
    );

    // Right arm
    this.drawArm(
      ctx,
      0,
      -torsoLength / 2 + 5 * s,
      p.rightShoulderAngle,
      p.rightElbowAngle,
      upperArmLength,
      forearmLength,
      p.limbColor,
      p.lineWidth
    );

    // Left leg
    this.drawLeg(
      ctx,
      torsoEndX,
      torsoEndY - torsoLength / 2,
      p.leftHipAngle,
      p.leftKneeAngle,
      thighLength,
      calfLength,
      p.limbColor,
      p.lineWidth
    );

    // Right leg
    this.drawLeg(
      ctx,
      torsoEndX,
      torsoEndY - torsoLength / 2,
      p.rightHipAngle,
      p.rightKneeAngle,
      thighLength,
      calfLength,
      p.limbColor,
      p.lineWidth
    );

    ctx.restore();
  }

  private drawArm(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    shoulderAngle: number,
    elbowAngle: number,
    upperLength: number,
    forearmLength: number,
    color: string,
    lineWidth: number
  ): void {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    // Upper arm
    const elbowX = startX + upperLength * Math.sin(shoulderAngle);
    const elbowY = startY + upperLength * Math.cos(shoulderAngle);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(elbowX, elbowY);
    ctx.stroke();

    // Forearm
    const handX = elbowX + forearmLength * Math.sin(shoulderAngle + elbowAngle);
    const handY = elbowY + forearmLength * Math.cos(shoulderAngle + elbowAngle);

    ctx.beginPath();
    ctx.moveTo(elbowX, elbowY);
    ctx.lineTo(handX, handY);
    ctx.stroke();

    // Hand (small circle)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(handX, handY, lineWidth, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawLeg(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    hipAngle: number,
    kneeAngle: number,
    thighLength: number,
    calfLength: number,
    color: string,
    lineWidth: number
  ): void {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    // Thigh
    const kneeX = startX + thighLength * Math.sin(hipAngle);
    const kneeY = startY + thighLength * Math.cos(hipAngle);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(kneeX, kneeY);
    ctx.stroke();

    // Calf
    const footX = kneeX + calfLength * Math.sin(hipAngle + kneeAngle);
    const footY = kneeY + calfLength * Math.cos(hipAngle + kneeAngle);

    ctx.beginPath();
    ctx.moveTo(kneeX, kneeY);
    ctx.lineTo(footX, footY);
    ctx.stroke();

    // Foot (small circle)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(footX, footY, lineWidth, 0, Math.PI * 2);
    ctx.fill();
  }
}
