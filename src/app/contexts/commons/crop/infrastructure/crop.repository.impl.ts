import { CropRepository } from 'commons/crop/infrastructure/crop.repository';
import { Crop } from 'commons/crop/domain/crop';
import { CropEntity } from 'commons/crop/infrastructure/crop.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { UUID } from 'shared/types/uuid';

export class CropRepositoryImpl implements CropRepository {
  constructor(
    @InjectRepository(CropEntity)
    protected readonly repository: Repository<CropEntity>,
  ) {
  }

  async findAll({
                  pagination,
                  searchText,
                }: {
    pagination: PaginationInput;
    searchText?: string;
  }): Promise<PaginationOutput<Crop>> {
    const condition: any = {};

    if (searchText) {
      condition.name = ILike(`%${searchText}%`);
    }

    const [result, total] = await this.repository.findAndCount({
      where: condition,
      order: {
        updatedAt: 'DESC',
      },
      take: pagination.maxPageSize,
      skip: pagination.maxPageSize * (pagination.page - 1),
    });

    const data = result.map((raw) => this.toDomain(raw));

    return {
      data,
      total,
    };
  }

  async create(crop: Crop): Promise<Crop> {
    const entity = this.toEntity(crop);

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findOneByUuid(uuid: UUID): Promise<Crop> {
    const result = await this.repository.findOne({
      where: {
        uuid,
      },
    });

    return result ? this.toDomain(result) : undefined;
  }

  async delete(uuid: string): Promise<void> {
    const entity = await this.repository.findOne({
      where: { uuid },
    });

    await this.repository.softDelete(entity.id);
  }

  async update(crop: Crop): Promise<Crop> {
    const entity = await this.repository.findOne({
      where: { uuid: crop.uuid },
    });

    entity.name = crop.name;
    entity.type = crop.type;
    entity.start = crop.start;
    entity.end = crop.end;

    const updated = await this.repository.save(entity);
    return this.toDomain(updated);
  }

  async findAutocomplete(query: string): Promise<any[]> {
    const limit = 10;

    return await this.repository
      .createQueryBuilder('crop')
      .select([
        'crop.name as name',
        'crop.uuid as uuid',
      ])
      .where('crop.name ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();
  }

  private toDomain(entity: CropEntity): Crop {
    return new Crop({
      id: entity.id,
      uuid: entity.uuid,
      type: entity.type,
      start: entity.start,
      end: entity.end,
    });
  }

  private toEntity(domain: Crop): CropEntity {
    const entity = new CropEntity();
    entity.id = domain.id;
    entity.uuid = domain.uuid;
    entity.name = domain.name;
    entity.type = domain.type;
    entity.start = domain.start;
    entity.end = domain.end;

    return entity;
  }
}
