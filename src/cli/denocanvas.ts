// This is a Canvas implementation that uses the x/canvas module

import { Canvas, ImageFormat, CanvasRenderingContext2D, Image } from '../core/types.ts';
import { createCanvas, EmulatedCanvas2D, loadImage } from 'https://deno.land/x/canvas@v1.4.1/mod.ts';

export class CanvasImpl implements Canvas {
  constructor(public width: number, public height: number) {
    this.canvas = createCanvas(width, height);
    this.ctx = this.canvas.getContext('2d');
  }

  private canvas: EmulatedCanvas2D;
  private ctx: CanvasRenderingContext2D;

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  async loadImage(src: string | Uint8Array): Promise<Image> {
    return await loadImage(src);
  }

  toDataURL(type?: ImageFormat, quality?: number): string {
    if (type === 'webp') {
      throw new Error('WebP is not supported');
    }
    const mime = `image/${type}` as 'image/png' | 'image/jpeg';
    console.log(mime);
    return this.canvas.toDataURL(mime, quality);
  }

  save(_path: string, type?: ImageFormat, quality?: number): void {
    const data = this.encode(type, quality);
    Deno.writeFile(_path, data).then(() => {
      return;
    });
  }

  encode(type?: ImageFormat, _quality?: number): Uint8Array {
    if (type === 'webp') {
      throw new Error('WebP is not supported');
    }
    const mime = `image/${type}` as 'image/png' | 'image/jpeg';
    const data = this.canvas.toBuffer(mime);
    return data;
  }
}

export default function createCanvasImpl(width: number, height: number): Canvas {
  return new CanvasImpl(width, height);
}
