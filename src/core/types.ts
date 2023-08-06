export type { CanvasRenderingContext2D, CanvasPattern, Image } from 'https://deno.land/x/canvas@v1.4.1/mod.ts';
import { CanvasRenderingContext2D, CanvasPattern, Image } from 'https://deno.land/x/canvas@v1.4.1/mod.ts';

export interface Canvas {
  width: number;
  height: number;
  getContext(): CanvasRenderingContext2D;
  toDataURL(type?: ImageFormat, quality?: number): string;
  save(path: string, type?: ImageFormat, quality?: number): void;
  encode(type?: ImageFormat, quality?: number): Uint8Array;
  loadImage(src: string | Uint8Array): Promise<Image>;
}

export type ImageFormat = 'png' | 'jpeg' | 'webp';

export interface CanvasGradient {
  addColorStop(offset: number, color: string): void;
}

export interface DOMMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export type Style = string | CanvasGradient | CanvasPattern;
export type FillRule = 'nonzero' | 'evenodd';

export interface CanvasRenderingContext2Da {
  fillStyle: Style;
  strokeStyle: Style;
  translate(x: number, y: number): void;
  rotate(angle: number): void;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
  rect(x: number, y: number, width: number, height: number): void;
  lineTo(x: number, y: number): void;
  closePath(): void;
  drawImage(image: Image, dx: number, dy: number, dWidth: number, dHeight: number): void;
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
  fill(): void;
  fill(rule: FillRule): void;
  fillRect(x: number, y: number, width: number, height: number): void;
  clearRect(x: number, y: number, width: number, height: number): void;
  beginPath(): void;
}
