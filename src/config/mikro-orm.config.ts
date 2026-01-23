import { Options } from '@mikro-orm/core';
import { User } from 'src/entities/user.entity';
import { Todo } from 'src/entities/todo.entity';
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
  entities: [User, Todo],
  debug: true,
};

export default mikroOrmConfig;
