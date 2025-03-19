/* eslint-disable @typescript-eslint/no-unused-vars */
import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';
import { RandomGenerator } from 'typeorm/util/RandomGenerator';

// https://github.com/typeorm/typeorm/blob/master/src/naming-strategy/DefaultNamingStrategy.ts#L105-L118
export class CustomNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  private generateHash(input: string): string {
    return RandomGenerator.sha1(input).substr(0, 8);
  }

  primaryKeyName(tableOrName: Table | string, columnNames: string[]) {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const columnsSnakeCase = columnNames.join('_');
    return `PK_${table}_${this.generateHash(columnsSnakeCase)}`;
  }

  tableName(targetName: string, userSpecifiedName: string | undefined): string {
    return userSpecifiedName || snakeCase(targetName);
  }

  /**
   * Creates a table name for a junction table of a closure table.
   *
   * @param originalClosureTableName Name of the closure table which owns this junction table.
   */
  closureJunctionTableName(originalClosureTableName: string): string {
    return originalClosureTableName + '_closure';
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return (
      snakeCase(embeddedPrefixes.concat('').join('_')) +
      (customName || snakeCase(propertyName))
    );
  }

  relationName(propertyName: string): string {
    return propertyName;
  }

  uniqueConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
  ): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort(function(a, b) {
      return a[1].localeCompare(b[1]);
    });
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    const key = `${replacedTableName}_${clonedColumnNames.join('_')}`;
    return 'UQ_' + key;
  }

  relationConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
    where?: string,
  ): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort(function(a, b) {
      return a[1].localeCompare(b[1]);
    });
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    let key = `${replacedTableName}_${clonedColumnNames.join('_')}`;
    if (where) key += `_${where}`;

    return 'REL_' + key;
  }

  defaultConstraintName(
    tableOrName: Table | string,
    columnName: string,
  ): string {
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    const key = `${replacedTableName}_${columnName}`;
    return 'DF_' + key;
  }

  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    _referencedTablePath?: string,
    _referencedColumnNames?: string[],
  ): string {
    const tableName = this.getTableName(tableOrName);
    const key = `${tableName}_${columnNames.sort().join('_')}`;
    return `FK_${tableName}_${this.generateHash(key)}`;
  }

  indexName(
    tableOrName: Table | string,
    columnNames: string[],
    where?: string,
  ): string {
    const tableName = this.getTableName(tableOrName);
    const key = `${tableName}_${columnNames.sort().join('_')}${where ? `_${where}` : ''}`;
    return `IDX_${tableName}_${this.generateHash(key)}`;
  }

  checkConstraintName(
    tableOrName: Table | string,
    expression: string,
    isEnum?: boolean,
  ): string {
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    const key = `${replacedTableName}_${expression}`;
    const name = 'CHK_' + key;
    return isEnum ? `${name}_ENUM` : name;
  }

  exclusionConstraintName(
    tableOrName: Table | string,
    expression: string,
  ): string {
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    const key = `${replacedTableName}_${expression}`;
    return 'XCL_' + key;
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(relationName + '_' + referencedColumnName);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string,
  ): string {
    return snakeCase(
      firstTableName +
      '_' +
      firstPropertyName.replace(/\./gi, '_') +
      '_' +
      secondTableName,
    );
  }

  joinTableColumnDuplicationPrefix(columnName: string, index: number): string {
    return columnName + '_' + index;
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(tableName + '_' + (columnName || propertyName));
  }

  joinTableInverseColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return this.joinTableColumnName(tableName, propertyName, columnName);
  }

  /**
   * Adds globally set prefix to the table name.
   * This method is executed no matter if prefix was set or not.
   * Table name is either user's given table name, either name generated from entity target.
   * Note that table name comes here already normalized by #tableName method.
   */
  prefixTableName(prefix: string, tableName: string): string {
    return prefix + tableName;
  }

  nestedSetColumnNames = { left: 'nsleft', right: 'nsright' };
  materializedPathColumnName = 'mpath';
}
