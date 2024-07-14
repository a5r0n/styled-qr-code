import { Options as QRCanvasOptions } from '../types/mod.ts';

export const GetQROptions = (url: URL) => {
  if (url.searchParams.has('o') && url.searchParams.get('o') !== '') {
    // All options are encoded in the 'o' parameter as a JSON string in base64
    const opts = JSON.parse(atob(url.searchParams.get('o') || '')) as QRCanvasOptions;

    if (url.searchParams.has('data') && url.searchParams.get('data') !== '') {
      opts.data = url.searchParams.get('data') || opts.data;
    }

    if (opts.image && !opts.image.toString().startsWith('http')) {
      throw new Error('Image must be a URL');
    }
    return opts;
  }

  const qrOptions = {
    data: url.searchParams.get('data') || '',
    width: url.searchParams.get('width') || 300,
    height: url.searchParams.get('height') || 300
  } as QRCanvasOptions;
  return qrOptions;
};
