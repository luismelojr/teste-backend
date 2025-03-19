import { Plan } from '../domain/plan';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { PlanFunctions } from 'plan/domain/plan-functions';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export abstract class PlanRepository {
  abstract create(plan: Plan): Promise<Plan>;

  abstract update(plan: Plan): Promise<Plan>;

  abstract delete(uuid: UUID): Promise<void>;

  abstract findOneById(id: EntityPrimaryKey): Promise<Plan>;

  abstract findOneByUuid(uuid: UUID): Promise<Plan>;

  abstract findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<Plan>>;

  abstract findAutocomplete(query: string): Promise<any[]>;

  abstract findFunctionByUuid(uuid: UUID): Promise<PlanFunctions>;

}
