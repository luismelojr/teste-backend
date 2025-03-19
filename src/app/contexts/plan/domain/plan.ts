import { UUID } from 'shared/types/uuid';
import { PlanFunctions } from 'plan/domain/plan-functions';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface PlanProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  name: string,
  description?: string,
  functions?: {
    id?: EntityPrimaryKey;
    uuid?: UUID;
    name: string,
    description?: string,
  }[]
}

export class Plan {
  private readonly _id: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _name: string;
  private readonly _description: string;
  private readonly _functions: PlanFunctions[];

  constructor(props: PlanProps) {
    this._id = props.id || undefined;
    this._uuid = props.uuid || undefined;
    this._name = props.name;
    this._description = props.description;

    if (props.functions) {
      this._functions = props.functions.map(planFunction => new PlanFunctions({
        id: planFunction.id,
        uuid: planFunction.uuid,
        name: planFunction.name,
        description: planFunction.description,
      }));
    }
  }

  static create(
    name: string,
    description?: string,
    functions?: {
      id?: EntityPrimaryKey;
      uuid?: UUID;
      name: string,
      description?: string,
    }[],
  ) {
    return new Plan({
      name,
      description,
      functions,
    });
  }

  get id(): EntityPrimaryKey {
    return this._id;
  }

  get uuid(): UUID {
    return this._uuid;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get functions(): PlanFunctions[] {
    return this._functions;
  }
}
