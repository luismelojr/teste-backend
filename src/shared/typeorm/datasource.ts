import { DataSource, DataSourceOptions } from 'typeorm';
import { getTypeOrmConfig } from './typeorm';

export function createDataSource(): DataSource {
  return new DataSource(getTypeOrmConfig() as DataSourceOptions);
}

const dataSource = createDataSource();

export default dataSource;
