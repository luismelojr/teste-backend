import {
  CultivationRepository
} from 'commons/cultivations/infrastructure/cultivation.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Cultivation } from 'commons/cultivations/domain/cultivation';
import {
  CultivationEntity
} from 'commons/cultivations/infrastructure/cultivation.entity';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput
} from 'shared/abstracts/paginations/pagination.output';
import { ILike, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export class CultivationRepositoryImpl implements CultivationRepository {
  constructor(
    @InjectRepository(CultivationEntity)
    protected readonly repository: Repository<CultivationEntity>
  ) {
  }

  async create(cultivation: Cultivation): Promise<Cultivation> {
    const entity = new CultivationEntity();
    entity.name = cultivation.name;
    entity.description = cultivation.description;

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(cultivation: Cultivation): Promise<Cultivation> {
    const entityToSave = await this.repository.preload({
      id: cultivation.id,
      uuid: cultivation.uuid,
      name: cultivation.name,
      description: cultivation.description,
    })

    if (!entityToSave) {
      throw new NotFoundException('cultivation is not found');
    }

    const updated = await this.repository.save(entityToSave);
    return this.toDomain(updated);
  }

  async delete(uuid: UUID): Promise<void> {
    const entity = await this.repository.findOne({
      where: { uuid },
    });

    await this.repository.softDelete(entity.id);
  }

  async findOneById(id: EntityPrimaryKey): Promise<Cultivation> {
    const where: any = { id };
    const result = await this.repository.findOne({
      where,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findOneByUuid(uuid: string): Promise<Cultivation> {
    const where: any = { uuid };
    const result = await this.repository.findOne({
      where,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<Cultivation>> {
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

    return await this.repository
      .createQueryBuilder('cultivation')
      .select([
        'CONCAT(cultivation.name) as name',
        'cultivation.uuid as uuid',
      ])
      .where('cultivation.name ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();
  }

  private toDomain(entity: CultivationEntity): Cultivation {
    return new Cultivation({
      id: entity.id,
      uuid: entity.uuid,
      name: entity.name,
      description: entity.description,
    });
  }
}
