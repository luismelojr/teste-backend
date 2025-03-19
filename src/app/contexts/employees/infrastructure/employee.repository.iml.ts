import { EmployeeRepository } from './employee.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from './employee.entity';
import { ILike, Repository } from 'typeorm';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { Employee } from '../domain/employee';
import {
  PaginationOutput
} from 'shared/abstracts/paginations/pagination.output';
import { UUID } from 'shared/types/uuid';

export class EmployeeRepositoryIml implements EmployeeRepository {
  constructor(
    @InjectRepository(EmployeeEntity)
    protected readonly repository: Repository<EmployeeEntity>
  ) {}

  async findAll ( {pagination, searchText}: {pagination: PaginationInput; searchText?: string}): Promise<PaginationOutput<Employee>> {
    const condition: any = {};

    if (searchText) {
      condition.business_email = ILike(`%${searchText}%`);
    }

    const [result, total] = await this.repository.findAndCount({
      where: condition,
      order: {
        updatedAt: 'DESC',
      },
      take: pagination.maxPageSize,
      skip: pagination.maxPageSize * (pagination.page - 1),
    })

    const data = result.map((raw) => this.toDomain(raw));

    return {
      data,
      total
    }
  }

  async findOneByUuid (uuid: UUID): Promise<Employee> {
    const result = await this.repository.findOne({
      where: { uuid }
    })

    return result ? this.toDomain(result) : undefined;
  }

  async findAutoComplete (query: string): Promise<any[]> {
    const limit = 10;

    return await this.repository
      .createQueryBuilder('employee')
      .select([
        'employee.business_phone as business_phone',
        'employee.business_email as business_email',
        'employee.uuid as uuid'
      ])
      .where('employee.business_email ILIKE :query', { query: `%${query}%` })
      .orWhere('employee.business_phone ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();
  }

  async create (employee: Employee): Promise<Employee> {
    const entity = new EmployeeEntity();
    entity.business_email = employee.business_email.getValue();
    entity.business_phone = employee.business_phone.getValue();
    entity.occupation = employee.occupation;
    entity.start_date = employee.start_date;
    entity.contract_type = employee.contract_type;
    entity.shutdown_date = employee.shutdown_date;

    const saved = await this.repository.save(entity);

    return this.toDomain(saved);
  }

  async update (employee: Employee): Promise<Employee> {
    const entity = await this.repository.findOne({
      where: {
        uuid: employee.uuid
      }
    });

    entity.business_email = employee.business_email.getValue();
    entity.business_phone = employee.business_phone.getValue();
    entity.occupation = employee.occupation;
    entity.start_date = employee.start_date;
    entity.contract_type = employee.contract_type;
    entity.shutdown_date = employee.shutdown_date;

    const saved = await this.repository.save(entity);

    return this.toDomain(saved);
  }

  async delete (uuid: UUID): Promise<void> {
    const entity = await this.repository.findOne({
      where: { uuid }
    });

    await this.repository.softDelete(entity.id);
  }

  private toDomain(domain: EmployeeEntity) {
    return new Employee({
      id: domain.id,
      uuid: domain.uuid,
      business_phone: domain.business_phone,
      business_email: domain.business_email,
      occupation: domain.occupation,
      start_date: domain.start_date,
      contract_type: domain.contract_type,
      shutdown_date: domain.shutdown_date
    });
  }
}
