import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';
import {
  ContractPlan,
  ContractPlanProps,
} from './value-objects/contract-plan';
import {
  ContractCompany,
  ContractCompanyProps,
} from './value-objects/contract-company';
import {
  ContractPerson,
  ContractPersonProps,
} from './value-objects/contract-person';
import { Customer } from 'customer/domain/customer';

interface ContractProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  identifier: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  plan: ContractPlanProps;
  company?: ContractCompanyProps;
  person?: ContractPersonProps;
  customerId?: EntityPrimaryKey;
}

interface ContractCreateProps {
  identifier: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  plan: ContractPlanProps;
  company?: ContractCompanyProps;
  person?: ContractPersonProps;
  customerId?: EntityPrimaryKey;
}

export class Contract {
  private readonly _id?: EntityPrimaryKey;
  private readonly _uuid?: UUID;
  private readonly _identifier: string;
  private readonly _description?: string;
  private readonly _startDate: Date;
  private readonly _endDate: Date;
  private readonly _plan: ContractPlan;
  private readonly _company?: ContractCompany;
  private readonly _person?: ContractPerson;
  private readonly _customerId?: EntityPrimaryKey;

  constructor(props: ContractProps) {
    if (props.startDate >= props.endDate) {
      throw new Error('A data de início deve ser anterior à data de término.');
    }

    if (!props.company && !props.person) {
      throw new Error('Contrato deve ter uma empresa ou pessoa associada.');
    }

    this._id = props.id;
    this._uuid = props.uuid;
    this._identifier = props.identifier;
    this._description = props.description;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._plan = new ContractPlan(props.plan);
    this._customerId = props.customerId;

    if (props.company) {
      this._company = new ContractCompany(props.company);
    }

    if (props.person) {
      this._person = new ContractPerson(props.person);
    }
  }

  static create(props: ContractCreateProps) {
    return new Contract({
      ...props,
    });
  }

  createCustomer(): Customer {
    let identifier: string;
    let groupIdentifier: string;

    if (this._company) {
      identifier = this._company.name;
      groupIdentifier = this._identifier;
    } else if (this._person) {
      identifier = this._person.name;
      groupIdentifier = this._identifier;
    } else {
      throw new Error('Não foi possível criar o cliente.');
    }

    return Customer.create({
      identifier,
      groupIdentifier,
      grainConsumer: {
        isConsumer: false,
        isOwnGrain: false,
        isReceiveThirdGrains: false,
        annualQuantity: 0,
      },
    });
  }

  linkToCustomer(customerId: EntityPrimaryKey): Contract {
    return new Contract({
      ...this.toProps(),
      customerId
    });
  }

  private toProps(): ContractProps {
    const props: ContractProps = {
      id: this._id,
      uuid: this._uuid,
      identifier: this._identifier,
      description: this._description,
      startDate: this._startDate,
      endDate: this._endDate,
      plan: {
        id: this._plan.id,
        uuid: this._plan.uuid,
        name: this._plan.name,
        description: this._plan.description
      },
      customerId: this._customerId
    };

    if (this._company) {
      props.company = {
        id: this._company.id,
        uuid: this._company.uuid,
        name: this._company.name,
        cnpj: this._company.cnpj
      };
    }

    if (this._person) {
      props.person = {
        id: this._person.id,
        uuid: this._person.uuid,
        name: this._person.name,
        cpf: this._person.cpf
      };
    }

    return props;
  }

  get id(): EntityPrimaryKey | undefined {
    return this._id;
  }

  get uuid(): UUID | undefined {
    return this._uuid;
  }

  get identifier(): string {
    return this._identifier;
  }

  get description(): string | undefined {
    return this._description;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  get plan(): ContractPlan {
    return this._plan;
  }

  get company(): ContractCompany | undefined {
    return this._company;
  }

  get person(): ContractPerson | undefined {
    return this._person;
  }

  get customerId(): EntityPrimaryKey | undefined {
    return this._customerId;
  }

  get hasCustomer(): boolean {
    return !!this._customerId;
  }

  get hasCompany(): boolean {
    return !!this._company;
  }

  get hasPerson(): boolean {
    return !!this._person;
  }

  get duration(): number {
    return Math.ceil(
      (this._endDate.getTime() - this._startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  get isActive(): boolean {
    const now = new Date();
    return now >= this._startDate && now <= this._endDate;
  }
}
