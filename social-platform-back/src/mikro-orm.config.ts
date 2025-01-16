import { MySqlDriver, defineConfig } from '@mikro-orm/mysql';

export default defineConfig({
  host: 'localhost',
  port: 6767,
  user: 'root',
  password: 'marcinek1',
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: 'twitterdb',
  driver: MySqlDriver,
});
