import { UUID } from 'shared/types/uuid';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface PersonProps {
  id: EntityPrimaryKey;
  uuid: UUID;
  name: string,
  cpf?: string,
  phone?: string,
  cityName?: string,
  nameState?: string,
  address?: string,
  gender?: PersonGenderType,
}

export class Person {
  private readonly _id: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _name: string;
  private readonly _cpf?: string;
  private readonly _phone?: string;
  private readonly _cityName?: string;
  private readonly _nameState?: string;
  private readonly _address?: string;
  private readonly _gender?: PersonGenderType;

  constructor(props: PersonProps) {
    this._id = props.id;
    this._uuid = props.uuid;
    this._name = props.name;
    this._cpf = props.cpf;
    this._phone = props.phone;
    this._cityName = props.cityName;
    this._nameState = props.nameState;
    this._address = props.address;
    this._gender = props.gender;
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

  get cpf(): string {
    return this._cpf;
  }

  get phone(): string {
    return this._phone;
  }

  get cityName(): string {
    return this._cityName;
  }

  get nameState(): string {
    return this._nameState;
  }

  get address(): string {
    return this._address;
  }

  get gender(): PersonGenderType {
    return this._gender;
  }
}
