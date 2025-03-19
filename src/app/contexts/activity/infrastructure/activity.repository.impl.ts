import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ActivityEntity } from './activity.entity';
import { ActivityRepository } from './activity.repository';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { Activity } from '../domain/activity';
import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export class ActivityRepositoryImpl
  implements ActivityRepository {
  constructor(
    @InjectRepository(ActivityEntity)
    protected readonly repository: Repository<ActivityEntity>,
  ) {
  }

  async create(activity: Activity): Promise<Activity> {
    const entity = new ActivityEntity();
    entity.name = activity.name;
    entity.description = activity.description;

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(activity: Activity): Promise<Activity> {
    const entityToSave = new ActivityEntity();
    entityToSave.id = activity.id;
    entityToSave.name = activity.name;
    entityToSave.description = activity.description;

    const updated = await this.repository.save(entityToSave);
    return this.toDomain(updated);
  }

  async delete(uuid: UUID): Promise<void> {
    const entity = await this.repository.findOne({
      where: { uuid },
    });

    if (!entity) {
      throw new Error('activity not found');
    }

    await this.repository.softDelete(entity.id);
  }

  async findOneById(id: EntityPrimaryKey): Promise<Activity> {
    const where: any = { id };
    const result = await this.repository.findOne({
      where,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findOneByUuid(uuid: string): Promise<Activity> {
    const where: any = { uuid };
    const result = await this.repository.findOne({
      where,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<Activity>> {
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
      .createQueryBuilder('activity')
      .select([
        'CONCAT(activity.name) as name',
        'activity.uuid as uuid',
      ])
      .where('activity.name ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();

    return result;
  }

  private toDomain(entity: ActivityEntity): Activity {
    return new Activity({
      id: entity.id,
      uuid: entity.uuid,
      name: entity.name,
      description: entity.description,
    });
  }

}

