import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { OccupationEntity } from './occupation.entity';
import { OccupationRepository } from './occupation.repository';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { Occupation } from '../domain/occupation';
import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export class OccupationRepositoryImpl
  implements OccupationRepository {
  constructor(
    @InjectRepository(OccupationEntity)
    protected readonly repository: Repository<OccupationEntity>,
  ) {
  }

  async create(occupation: Occupation): Promise<Occupation> {
    const entity = new OccupationEntity();
    entity.name = occupation.name;
    entity.description = occupation.description;

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(occupation: Occupation): Promise<Occupation> {
    const entityToSave = new OccupationEntity();
    entityToSave.id = occupation.id;
    entityToSave.name = occupation.name;
    entityToSave.description = occupation.description;

    const updated = await this.repository.save(entityToSave);
    return this.toDomain(updated);
  }

  async delete(uuid: UUID): Promise<void> {
    const entity = await this.repository.findOne({
      where: { uuid },
    });

    if (!entity) {
      throw new Error('occupation not found');
    }

    await this.repository.softRemove(entity);
  }

  async findOneById(id: EntityPrimaryKey): Promise<Occupation> {
    const where: any = { id };
    const result = await this.repository.findOne({
      where,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findOneByUuid(uuid: string): Promise<Occupation> {
    const where: any = { uuid };
    const result = await this.repository.findOne({
      where,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<Occupation>> {
    const conditions: any[] = [];

    if (searchText) {
      conditions.push(
        { name: ILike(`%${searchText}%`) },
      );
    }

    const [results, total] = await this.repository.findAndCount({
      where: conditions,
      order: {
        updatedAt: 'DESC',
      },
      take: pagination.maxPageSize,
      skip: pagination.maxPageSize * (pagination.page - 1),
    });

    const data = results.map((raw) => this.toDomain(raw));

    return {
      data,
      total,
    };
  }

  async findAutocomplete(query: string): Promise<any[]> {
    const limit = 10;

    const result = await this.repository
      .createQueryBuilder('occupation')
      .select([
        'CONCAT(occupation.name) as name',
        'occupation.uuid as uuid',
      ])
      .where('occupation.name ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();

    return result;
  }

  private toDomain(entity: OccupationEntity): Occupation {
    return new Occupation({
      id: entity.id,
      uuid: entity.uuid,
      name: entity.name,
      description: entity.description,
    });
  }

}

