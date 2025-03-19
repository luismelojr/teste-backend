import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CompanyEntity } from './company.entity';
import { CompanyRepository } from './company.repository';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { Company } from '../domain/company';
import { CityEntity } from 'commons/locations/city/infrastructure/city.entity';
import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export class CompanyRepositoryImpl
  implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    protected readonly repository: Repository<CompanyEntity>,
  ) {
  }

  async create(company: Company): Promise<Company> {
    const entity = new CompanyEntity();
    entity.name = company.name.getValue();
    entity.tradeName = company.tradeName?.getValue();
    entity.cnpj = company.cnpj.getValue();
    entity.phone = company.phone?.getValue();
    entity.address = company.address;
    entity.email = company.email?.getValue();

    if (company.city) {
      entity.city = { id: company.city.getId() } as CityEntity;
    }

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(company: Company): Promise<Company> {
    const entityToSave = new CompanyEntity();
    entityToSave.id = company.id;
    entityToSave.name = company.name.getValue();
    entityToSave.tradeName = company.tradeName?.getValue();
    entityToSave.cnpj = company.cnpj.getValue();
    entityToSave.phone = company.phone?.getValue();
    entityToSave.address = company.address;
    entityToSave.email = company.email?.getValue();

    if (company.city) {
      entityToSave.city = { id: company.city.getId() } as CityEntity;
    }

    const updated = await this.repository.save(entityToSave);
    return this.toDomain(updated);
  }

  async delete(uuid: UUID): Promise<void> {
    const entity = await this.repository.findOne({
      where: { uuid },
    });

    if (!entity) {
      throw new Error('company not found');
    }

    await this.repository.softRemove(entity);
  }

  async findOneById(id: EntityPrimaryKey): Promise<Company> {
    const where: any = { id };
    const relations = ['city'];
    const result = await this.repository.findOne({
      where,
      relations,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findOneByUuid(uuid: string): Promise<Company> {
    const where: any = { uuid };
    const relations = ['city'];
    const result = await this.repository.findOne({
      where,
      relations,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<Company>> {
    const conditions: any[] = [];
    const relations = ['city'];

    if (searchText) {
      conditions.push(
        { name: ILike(`%${searchText}%`) },
        { tradeName: ILike(`%${searchText}%`) },
        { cnpj: ILike(`%${searchText}%`) },
      );
    }

    const [results, total] = await this.repository.findAndCount({
      where: conditions,
      relations,
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
      .createQueryBuilder('company')
      .select([
        'CONCAT(company.name, \' - \', company.cnpj) as name',
        'company.uuid as uuid',
      ])
      .where('company.name ILIKE :query', { query: `%${query}%` })
      .orWhere('company.cnpj ILIKE :query', { query: `%${query}%` })
      .orWhere('company.tradeName ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();

    return result;
  }

  private toDomain(entity: CompanyEntity): Company {
    const city = entity.city;

    return new Company({
      id: entity.id,
      uuid: entity.uuid,
      name: entity.name,
      tradeName: entity.tradeName,
      cnpj: entity.cnpj,
      phone: entity.phone,
      city: city ? {
        id: city?.id,
        uuid: city?.uuid,
        name: city?.name,
      } : undefined,
      address: entity.address,
      email: entity.email,
    });
  }

}

