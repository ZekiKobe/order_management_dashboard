import { createApp } from './app';
import { env } from './config/env';
import { sequelize } from './config/database';

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const app = createApp();
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on port ${env.port}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();

