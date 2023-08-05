import { Application, Router } from 'https://deno.land/x/oak@v12.6.0/mod.ts';
import loggerMiddleware from 'https://deno.land/x/oak_logger@1.0.0/mod.ts';
import Logger from 'https://deno.land/x/logger@v1.1.1/logger.ts';
import { Options as QRCanvasOptions } from '../types/mod.ts';
import { QRCodeCanvas } from '../index.ts';
const logger = new Logger();

//Register your Oak App
const app = new Application();
const router = new Router();

const GetQROptions = (url: URL) => {
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

router.get('/url/:format', (ctx) => {
  const qr = new QRCodeCanvas(GetQROptions(ctx.request.url));
  const format = ctx.params.format;
  if (format !== 'png' && format !== 'jpeg' && format !== 'webp') {
    ctx.response.body = 'Invalid format';
    return;
  }

  ctx.response.body = async () => {
    return await qr.toDataUrl(format);
  };
});

router.get('/image/:format', (ctx) => {
  const qr = new QRCodeCanvas(GetQROptions(ctx.request.url));
  const format = ctx.params.format;
  if (format !== 'png' && format !== 'jpeg' && format !== 'webp') {
    ctx.response.body = 'Invalid format';
    ctx.response.status = 400;
    return;
  }

  ctx.response.headers.set('Content-Type', `image/${format}`);
  ctx.response.body = async () => {
    return await qr.toBuffer(format);
  };
});

app.use(loggerMiddleware.logger);
app.use(loggerMiddleware.responseTime);
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
export const Serve = () => {
  logger.info('Server running on http://localhost:8000');
  return app.listen({ port: 8000 });
};
