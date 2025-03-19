import { join } from 'path';
import { config as dotenvConfig } from 'dotenv';
import { CustomNamingStrategy } from './custom-naming-strategy';
import { getEnvFilePath } from '../config/env';

export const TYPEORM_CONFIG_NAME = 'typeorm';
const DATABASE_TYPE = 'postgres';

dotenvConfig({ path: getEnvFilePath() });

const typeOrmConfig = {
  type: DATABASE_TYPE,
  url: process.env.DATABASE_URL,
  synchronize:
    process.env.DATABASE_ORM_SYNCHRONIZE === 'true' &&
    process.env.NODE_ENV !== 'production',
  autoLoadEntities: true,
  entities: [join(__dirname, '../../app/contexts/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../../database/migrations/**/*{.ts,.js}')],
  subscribers: [join(__dirname, '../../app/contexts/**/*.subscriber{.ts,.js}')],
  namingStrategy: new CustomNamingStrategy(),
  extra: {
    integerTypeCasting: 'string',
  },
  logging: 'true',
};

export const getTypeOrmConfig = () => typeOrmConfig;
export default typeOrmConfig;
