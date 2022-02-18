import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

// Default database type is mysql
const dbType: any = (dbtype: string) =>
  dbtype ? String(dbtype) || 'mysql' : 'mysql';
// Default port is 3306
const dbPort = process.env.DB_PORT || '3306';

const entities: any = [join(__dirname, '../', 'entities/*.entity{.ts,.js}')];

const config: ConnectionOptions = {
  type: dbType(process.env.DB_TYPE),
  host: process.env.DB_HOST,
  port: parseInt(dbPort, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities,
};

export = config;
