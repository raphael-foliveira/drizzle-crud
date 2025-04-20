import { createApp } from './app';

const start = async () => {
  try {
    const app = await createApp();
    await app.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
