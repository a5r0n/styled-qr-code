import { parse } from 'https://deno.land/std@0.197.0/flags/mod.ts';
import QRCanvas from '../core/QRCanvas.ts';
import { Options } from '../types/mod.ts';
import defaultOptions from '../core/QROptions.ts';
import { DotType } from '../types/mod.ts';
import createCanvas from './denocanvas.ts';

export async function main(args: string[]) {
  const {
    help, // -h, --help
    version, // -v, --version
    _: [data], // data
    margin, // --margin
    w, // -w
    width, // --width
    h, // -h
    height, // --height
    'dots-type': dots_type, // --dots-type
    'dots-color': dots_color, // --dots-color
    'bg-color': background_color, // --bg-color
    image, // --image
    'image-margin': image_margin, // --image-margin
    'image-size': image_size // --image-size
  } = parse(args);

  if (help) {
    console.log(`
      Usage: qrcode [options]

      Options:
        -h, --help              output usage information
        -v, --version           output the version number
        -w --width <width>         width, default is 300
        -h --height <height>       height, default is 300
        --margin <margin>       margin, default is 0
        --dots-type <type>      dots type, can be any of the DotType enum values: square, circle, diamond, rounded-square, rounded-circle, rounded-diamond
        --dots-color <color>    dots color, can be any valid css color value
        --bg-color <color>      background color, can be any valid css color value
        --image <image>         image to embed in the center of the QR code
        --image-margin <margin> image margin, default is 0
        --image-size <size>     image size, default is 0.4
    `);
  } else if (version) {
    console.log('0.0.1');
  } else if (!data) {
    console.log('Please input data to encode');
  } else {
    const opts = {
      data,
      dotsOptions: {
        type: dots_type ? (dots_type as DotType) : defaultOptions.dotsOptions.type,
        color: dots_color ? dots_color : defaultOptions.dotsOptions.color
      },
      backgroundOptions: {
        color: background_color || defaultOptions.backgroundOptions.color
      },
      qrOptions: {
        errorCorrectionLevel: 'M'
      },
      image: image,
      imageOptions: {
        crossOrigin: 'anonymous',
        hideBackgroundDots: true,
        imageSize: image_size || defaultOptions.imageOptions.imageSize,
        margin: image_margin || defaultOptions.imageOptions.margin
      },
      margin: margin || defaultOptions.margin,
      width: w || width || 300,
      height: h || height || 300
    } as Options;

    if (opts.width === undefined) {
      opts.width = opts.height || 300;
    }

    if (opts.height === undefined) {
      opts.height = opts.width || 300;
    }

    const canvas = createCanvas(opts.width || opts.height, opts.height || opts.width);
    const qr = new QRCanvas(canvas, opts);

    await qr.created;
    console.log(canvas.toDataURL('png'));
  }
}
