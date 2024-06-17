import { Position } from '../../shared/models/position';
import { Square } from '../models/square';
import { FILL_STYLE } from '../models/fill-style';

export class CanvasUtils {
  static drawCircle(context: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.stroke();
  }

  static drawSquare(context: CanvasRenderingContext2D, square: Square) {
    const { x, y } = square;

    context.beginPath();
    context.rect(x, y, 25, 25);
    context.fillStyle = square.fillStyle;
    context.fill();
    context.stroke();
  }

  static clearRect(context: CanvasRenderingContext2D, x: number, y: number) {
    context.clearRect(x, y, 28, 28);
  }

  static clearCircle(context: CanvasRenderingContext2D, x: number, y: number, radius: number) {
    context.save();

    context.beginPath();
    context.arc(x - 1, y - 1, radius + 3, 0, 2 * Math.PI);
    context.clip();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.restore();
  }

  static isOutsideCanvas(canvas: HTMLCanvasElement, x: number, y: number): boolean {
    return x < 0 || x > canvas.width + 1 || y < 0 || y > canvas.height + 1;
  }

  static getBallPosition(canvas: HTMLCanvasElement): Position {
    const x = canvas.width / 2;
    const y = canvas.height - 30;

    return { x, y };
  }

  static generateSquare(canvas: HTMLCanvasElement): Square {
    const x = Math.floor(Math.random() * canvas.width);

    return { x, y: 0, fillStyle: Math.random() < 0.2 ? FILL_STYLE.BAD_SQUARE : FILL_STYLE.SQUARE };
  }

  static calculateSpeed(ballPosition: Position, pointPosition: Position): { x: number, y: number } {
    const lineLength = Math.sqrt((pointPosition.x - ballPosition.x) ** 2 + (pointPosition.y - ballPosition.y) ** 2);
    const speed = 25;
    const speedX = (pointPosition.x - ballPosition.x) / lineLength * speed;
    const speedY = (pointPosition.y - ballPosition.y) / lineLength * speed;

    return { x: speedX, y: speedY };
  }

  static isCollision(ballPosition: Position, squarePosition: Position): boolean {
    return ballPosition.x < squarePosition.x + 30 &&
      ballPosition.x + 30 > squarePosition.x &&
      ballPosition.y < squarePosition.y + 30 &&
      ballPosition.y + 30 > squarePosition.y;
  }
}
