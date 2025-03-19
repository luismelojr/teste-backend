import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { EventTypeEntity } from './event-type.entity';
import { EventTypeRepository } from './event-type.repository';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { EventType } from '../domain/event-type';
import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export class EventTypeRepositoryImpl
  implements EventTypeRepository {
  constructor(
    @InjectRepository(EventTypeEntity)
    protected readonly repository: Repository<EventTypeEntity>,
  ) {
  }

  async create(eventType: EventType): Promise<EventType> {
    const entity = new EventTypeEntity();
    entity.name = eventType.name;
    entity.description = eventType.description;

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(eventType: EventType): Promise<EventType> {
    const entityToSave = new EventTypeEntity();
    entityToSave.id = eventType.id;
    entityToSave.name = eventType.name;
    entityToSave.description = eventType.description;

    const updated = await this.repository.save(entityToSave);
    return this.toDomain(updated);
  }

  async delete(uuid: UUID): Promise<void> {
    const entity = await this.repository.findOne({
      where: { uuid },
    });

    if (!entity) {
      throw new Error('event-type not found');
    }

    await this.repository.softRemove(entity);
  }

  async findOneById(id: EntityPrimaryKey): Promise<EventType> {
    const where: any = { id };
    const result = await this.repository.findOne({
      where,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findOneByUuid(uuid: string): Promise<EventType> {
    const where: any = { uuid };
    const result = await this.repository.findOne({
      where,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<EventType>> {
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
      .createQueryBuilder('eventType')
      .select([
        'CONCAT(eventType.name) as name',
        'eventType.uuid as uuid',
      ])
      .where('eventType.name ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();

    return result;
  }

  private toDomain(entity: EventTypeEntity): EventType {
    return new EventType({
      id: entity.id,
      uuid: entity.uuid,
      name: entity.name,
      description: entity.description,
    });
  }

}

