import * as fs from 'fs';
import * as path from 'path';

export const seedDatabase = async (dataSource) => {
  const sqlFilePath = path.join(
    __dirname,
    '../../database/seeds',
    'brasil.sql',
  );
  console.log(`Lendo arquivo SQL de: ${sqlFilePath}`);
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

  await dataSource.initialize();
  console.log('Conexão com o banco de dados estabelecida.');

  const statements = sqlContent
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement);

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    try {
      for (const statement of statements) {
        await queryRunner.query(`${statement};`);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      console.error('Erro durante a execução do SQL:', error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    const countStates = await dataSource.query('SELECT COUNT(*) FROM states');
    const countCities = await dataSource.query('SELECT COUNT(*) FROM cities');
    console.log('Estados criados: ', countStates);
    console.log('Cidades criados: ', countCities);
    console.log('Seeds executados com sucesso!');
  } catch (error) {
    console.error(
      'Erro ao executar o arquivo SQL:',
      error.message,
      error.stack,
    );
  } finally {
    await dataSource.destroy();
    console.log('Conexão com o banco de dados encerrada.');
  }
};
