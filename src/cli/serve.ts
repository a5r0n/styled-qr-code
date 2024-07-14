import { Application, Router } from 'https://deno.land/x/oak@v12.6.0/mod.ts';
import loggerMiddleware from 'https://deno.land/x/oak_logger@1.0.0/mod.ts';
import Logger from 'https://deno.land/x/logger@v1.1.1/logger.ts';
import { QRCodeCanvas } from '../index.ts';
import createCanvas from './denocanvas.ts';
import { GetQROptions } from './utils.ts';
import { Options as QRCanvasOptions } from '../types/mod.ts';

const logger = new Logger();
const kv = await Deno.openKv();

//Register your Oak App
const app = new Application();
const router = new Router();

const getPresetOrOptions = async (url: URL) => {
  if (url.searchParams.has('p')) {
    const opts = (await kv.get(['preset', url.searchParams.get('p') || ''])).value as QRCanvasOptions;
    if (!opts) {
      throw new Error('Preset not found');
    }

    if (url.searchParams.has('data') && url.searchParams.get('data') !== '') {
      opts.data = url.searchParams.get('data') || opts.data;
    }

    if (url.searchParams.has('width') && url.searchParams.get('width') !== '') {
      opts.width = parseInt(url.searchParams.get('width') || '300');
      opts.height = opts.width;
    }

    if (url.searchParams.has('height') && url.searchParams.get('height') !== '') {
      opts.height = parseInt(url.searchParams.get('height') || '300');
    }

    if (url.searchParams.has('image') && url.searchParams.get('image') !== '') {
      opts.image = url.searchParams.get('image') || opts.image;
    }

    if (opts.image && !opts.image.toString().startsWith('http')) {
      throw new Error('Image must be a URL');
    }

    return opts;
  } else {
    return GetQROptions(url);
  }
};

router.get('/url/:format', async (ctx) => {
  const opts = await getPresetOrOptions(ctx.request.url);
  const canvas = createCanvas(opts.width || 300, opts.height || 300);
  const qr = new QRCodeCanvas(canvas, opts);
  const format = ctx.params.format;
  if (format !== 'png' && format !== 'jpeg') {
    ctx.response.body = 'Invalid format';
    return;
  }

  ctx.response.body = async () => {
    return await qr.toDataUrl(format);
  };
});

router.get('/image/:format', async (ctx) => {
  const opts = await getPresetOrOptions(ctx.request.url);
  const canvas = createCanvas(opts.width || 300, opts.height || 300);
  const qr = new QRCodeCanvas(canvas, opts);

  const format = ctx.params.format;
  if (format !== 'png' && format !== 'jpeg') {
    ctx.response.body = 'Invalid format';
    ctx.response.status = 400;
    return;
  }

  ctx.response.headers.set('Content-Type', `image/${format}`);
  ctx.response.body = async () => {
    return await qr.toBuffer(format);
  };
});

router.post('/presets', async (ctx) => {
  const id = crypto.randomUUID();
  const data = await ctx.request.body().value;
  if (!data) {
    ctx.response.body = 'No data provided';
    ctx.response.status = 400;
    return;
  }
  console.log(data);
  await kv.set(['preset', id], data);
  ctx.response.body = id;
});

router.get('/presets/:id', async (ctx) => {
  const id = ctx.params.id;
  const data = await kv.get(['preset', id]);
  if (!data) {
    ctx.response.body = 'No data found';
    ctx.response.status = 404;
    return;
  }
  ctx.response.body = data;
});

router.delete('/presets/:id', async (ctx) => {
  const id = ctx.params.id;
  await kv.delete(['preset', id]);
  ctx.response.body = 'Deleted';
});

router.get('/presets', async (ctx) => {
  const keys = await kv.list({ prefix: ['preset'] });
  ctx.response.body = keys;
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
