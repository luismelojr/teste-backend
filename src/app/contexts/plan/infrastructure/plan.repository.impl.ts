import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { PlanEntity } from './entities/plan.entity';
import { PlanRepository } from './plan.repository';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { Plan } from '../domain/plan';
import { UUID } from 'shared/types/uuid';
import {
  PlanFunctionEntity,
} from 'plan/infrastructure/entities/plan-function.entity';
import { PlanFunctions } from 'plan/domain/plan-functions';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export class PlanRepositoryImpl
  implements PlanRepository {
  constructor(
    @InjectRepository(PlanEntity)
    protected readonly repository: Repository<PlanEntity>,
    @InjectRepository(PlanFunctionEntity)
    protected readonly functionRepository: Repository<PlanFunctionEntity>,
  ) {
  }

  async create(plan: Plan): Promise<Plan> {
    const entity = new PlanEntity();
    entity.name = plan.name;
    entity.description = plan.description;

    if (plan.functions?.length) {
      entity.functions = plan.functions.map((func) => {
        const planFunction = new PlanFunctionEntity();
        planFunction.name = func.name;
        planFunction.description = func.description;
        return planFunction;
      });
    }

    const saved = await this.repository.save(entity);
    return this.findOneById(saved.id);
  }

  async update(plan: Plan): Promise<Plan> {
    const entityToSave = new PlanEntity();
    entityToSave.name = plan.name;
    entityToSave.description = plan.description;

    if (plan.functions?.length) {
      entityToSave.functions = plan.functions.map((func) => {
        const planFunction = new PlanFunctionEntity();
        planFunction.id = func.id;
        planFunction.uuid = func.uuid;
        planFunction.name = func.name;
        planFunction.description = func.description;
        return planFunction;
      });
    }

    const updated = await this.repository.save(entityToSave);
    return this.findOneById(updated.id);
  }

  async delete(uuid: UUID): Promise<void> {
    const entity = await this.repository.findOne({
      where: { uuid },
    });

    if (!entity) {
      throw new Error('plan not found');
    }

    await this.repository
      .createQueryBuilder()
      .update(PlanFunctionEntity)
      .set({ deletedAt: new Date() })
      .where('planId = :planId', { id: entity.id })
      .execute();

    await this.repository.softRemove(entity);
  }

  async findOneById(id: EntityPrimaryKey): Promise<Plan> {
    const where: any = { id };
    const relations = ['functions'];
    const result = await this.repository.findOne({
      where,
      relations,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findOneByUuid(uuid: string): Promise<Plan> {
    const where: any = { uuid };
    const relations = ['functions'];
    const result = await this.repository.findOne({
      where,
      relations,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<Plan>> {
    const conditions: any[] = [];
    const relations = ['functions'];

    if (searchText) {
      conditions.push(
        { name: ILike(`%${searchText}%`) },
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
      .createQueryBuilder('plan')
      .select([
        'CONCAT(plan.name) as name',
        'plan.uuid as uuid',
      ])
      .where('plan.name ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();

    return result;
  }

  private toDomain(entity: PlanEntity): Plan {
    return new Plan({
      id: entity.id,
      uuid: entity.uuid,
      name: entity.name,
      description: entity.description,
      functions: entity.functions,
    });
  }

  async findFunctionByUuid(uuid: string): Promise<PlanFunctions> {
    const where: any = { uuid };
    const result = await this.functionRepository.findOne({
      where,
    });

    if (!result) return undefined;

    return new PlanFunctions({
      id: result.id,
      uuid: result.uuid,
      name: result.name,
      description: result.description,
    });
  }

}

