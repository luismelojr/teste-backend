import { DataSource } from 'typeorm';

export default class FixtureHelper {
  async loadFixtures({
                       fixtures,
                       dataSource = null,
                     }: {
    fixtures: any[];
    dataSource: DataSource;
  }) {
    const entities = dataSource.entityMetadatas;
    await this.clearTables(entities, dataSource);
    await this.loadFixtures_(dataSource, fixtures);
  }

  async clearTables(entities, dataSource) {
    try {
      const tableNames = entities
        .filter(
          (entity) =>
            entity.tableName !== 'cities' && entity.tableName !== 'states',
        )
        .map((entity) => `"${entity.tableName}"`)
        .join(', ');

      await dataSource.query(
        `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`,
      );
    } catch (error) {
      throw new Error(`ERROR: Cleaning test database: ${error}`);
    }
  }

  async loadFixtures_(dataSource, fixtures) {
    try {
      for (const fixture of fixtures) {
        const repository = await dataSource.getRepository(fixture.entity);
        const entity = repository.create(fixture.data);
        await repository.save(entity);
      }
    } catch (err) {
      throw err;
    }
  }
}
