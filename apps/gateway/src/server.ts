import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';

const app = Fastify({
  logger: true
});

await app.register(helmet);
await app.register(cors);

app.get('/health', async () => {
  return {
    status: 'ok',
    service: 'gateway'
  };
});

const port = Number(process.env.PORT ?? 4000);

try {
  await app.listen({
    host: '0.0.0.0',
    port
  });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}