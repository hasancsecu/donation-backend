import { registerAs } from '@nestjs/config';

export default registerAs('databaseConfig', () => ({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT as string) || 5432,
  name: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNCHORIZE === 'true' ? true : false,
  autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true' ? true : false,
}));
