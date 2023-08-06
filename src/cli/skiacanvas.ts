// This is a Canvas implementation that uses the x/canvas module

import { Canvas, ImageFormat, CanvasRenderingContext2D, Image } from '../core/types.ts';
import {
  createCanvas,
  Canvas as EmulatedCanvas2D,
  Image as EmulatedCanvasImage
} from 'https://deno.land/x/skia_canvas@0.5.4/mod.ts';

export class CanvasImpl implements Canvas {
  constructor(public width: number, public height: number) {
    this.canvas = createCanvas(width, height);
    this.ctx = this.canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
  }

  private canvas: EmulatedCanvas2D;
  private ctx: CanvasRenderingContext2D;

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  toDataURL(type?: ImageFormat, quality?: number): string {
    return this.canvas.toDataURL(type, quality);
  }

  save(path: string, type?: ImageFormat, quality?: number): void {
    return this.canvas.save(path, type, quality);
  }

  encode(type?: ImageFormat, quality?: number): Uint8Array {
    const data = this.canvas.encode(type, quality);
    return data;
  }

  async loadImage(src: string | Uint8Array): Promise<Image> {
    return (await EmulatedCanvasImage.load(src as string)) as unknown as Image;
  }
}

export default function createCanvasImpl(width: number, height: number): Canvas {
  return new CanvasImpl(width, height);
}
