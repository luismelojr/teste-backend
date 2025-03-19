import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CustomerRepository } from './customer.repository';
import { CustomerEntity } from './customer.entity';
import { Customer } from '../domain/customer';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { PaginationOutput } from 'shared/abstracts/paginations/pagination.output';
import { NotFoundException } from '@nestjs/common';

export class CustomerRepositoryImpl implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {}

  async create(customer: Customer): Promise<Customer> {
    const entity = new CustomerEntity();
    entity.identifier = customer.identifier;
    entity.group_identifier = customer.group_identifier || null;
    entity.description = customer.description || null;
    entity.financial_tools = customer.financial_tools ?? null;
    entity.grain_consumer = customer.grain_consumer ?? null;
    entity.own_grain = customer.own_grain ?? null;
    entity.annual_quantity = customer.annual_quantity ?? null;
    entity.receive_third_grains = customer.receive_third_grains ?? null;
    entity.receives_land_rent = customer.receives_land_rent ?? null;

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(customer: Customer): Promise<Customer> {
    const entity = await this.repository.findOne({ where: { uuid: customer.uuid } });

    if (!entity) {
      throw new NotFoundException('Customer not found');
    }

    entity.identifier = customer.identifier;
    entity.group_identifier = customer.group_identifier || null;
    entity.description = customer.description || null;
    entity.financial_tools = customer.financial_tools ?? null;
    entity.grain_consumer = customer.grain_consumer ?? null;
    entity.own_grain = customer.own_grain ?? null;
    entity.annual_quantity = customer.annual_quantity ?? null;
    entity.receive_third_grains = customer.receive_third_grains ?? null;
    entity.receives_land_rent = customer.receives_land_rent ?? null;

    const updated = await this.repository.save(entity);
    return this.toDomain(updated);
  }

  async delete(uuid: UUID): Promise<void> {
    const entity = await this.repository.findOne({ where: { uuid } });

    if (!entity) {
      throw new NotFoundException('Customer not found');
    }

    await this.repository.softRemove(entity);
  }

  async findOneByUuid(uuid: UUID): Promise<Customer> {
    const entity = await this.repository.findOne({ where: { uuid } });
    return entity ? this.toDomain(entity) : undefined;
  }

  async findAll({
                  pagination,
                  searchText,
                }: {
    pagination: PaginationInput;
    searchText?: string;
  }): Promise<PaginationOutput<Customer>> {
    const conditions: any = [];

    if (searchText) {
      conditions.push({ identifier: ILike(`%${searchText}%`) });
      conditions.push({ group_identifier: ILike(`%${searchText}%`) });
    }

    const [results, total] = await this.repository.findAndCount({
      where: conditions,
      order: { updatedAt: 'DESC' },
      take: pagination.maxPageSize,
      skip: pagination.maxPageSize * (pagination.page - 1),
    });

    const data = results.map((raw) => this.toDomain(raw));

    return { data, total };
  }

  async findAutoComplete(query: string): Promise<any[]> {
    const limit = 10;

    return await this.repository
      .createQueryBuilder('customer')
      .select(['customer.identifier as identifier', 'customer.uuid as uuid'])
      .where('customer.identifier ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();
  }

  private toDomain(entity: CustomerEntity): Customer {
    return new Customer({
      id: entity.id,
      uuid: entity.uuid,
      identifier: entity.identifier,
      group_identifier: entity.group_identifier || undefined,
      description: entity.description || undefined,
      financial_tools: entity.financial_tools ?? undefined,
      grain_consumer: entity.grain_consumer ?? undefined,
      own_grain: entity.own_grain ?? undefined,
      annual_quantity: entity.annual_quantity ?? undefined,
      receive_third_grains: entity.receive_third_grains ?? undefined,
      receives_land_rent: entity.receives_land_rent ?? undefined,
    });
  }
}
