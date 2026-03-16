import { Sequelize } from 'sequelize';
import { env } from './env';

export const sequelize = new Sequelize(
  env.db.database,
  env.db.username,
  env.db.password,
  {
    host: env.db.host,
    port: env.db.port,
    dialect: 'mysql',
    logging: false,
  }
);

