import { Options } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';

import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import dotenv from 'dotenv';
dotenv.config();

const mikroOrmConfig: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_USERNAME,
  entities: ['dist/entities'],
  entitiesTs: ['src/entities'],
  extensions: [Migrator],
  debug: true,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
};

export default mikroOrmConfig;
