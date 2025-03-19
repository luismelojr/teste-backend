import { UUID } from 'shared/types/uuid';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { City } from 'commons/locations/city/domain/city';
import Cpf from 'commons/value-objects/cpf';
import Phone from 'commons/value-objects/phone';
import Name from 'commons/value-objects/name';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface PersonProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  name: string,
  cpf: string,
  phone?: string,
  city?: City,
  address?: string,
  gender?: PersonGenderType,
}

export class Person {
  private readonly _id: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _name: Name;
  private readonly _cpf: Cpf;
  private readonly _phone: Phone;
  private readonly _city: City;
  private readonly _address: string;
  private readonly _gender: PersonGenderType;

  constructor(props: PersonProps) {
    this._id = props.id || undefined;
    this._uuid = props.uuid || undefined;
    this._name = new Name(props.name);
    this._cpf = new Cpf(props.cpf);

    if (props.phone) {
      this._phone = new Phone(props.phone);
    }

    this._city = props.city;
    this._address = props.address;
    this._gender = props.gender;
  }

  static create(
    name: string,
    cpf: string,
    phone: string,
    city: City,
    address: string,
    gender: PersonGenderType,
  ) {
    return new Person({
      name,
      cpf,
      phone,
      city,
      address,
      gender,
    });
  }

  public get id(): EntityPrimaryKey {
    return this._id;
  }

  public get uuid(): UUID {
    return this._uuid;
  }

  public get name(): Name {
    return this._name;
  }

  public get cpf(): Cpf {
    return this._cpf;
  }

  public get phone(): Phone {
    return this._phone;
  }

  public get city(): City | undefined {
    return this._city;
  }

  public get address(): string | undefined {
    return this._address;
  }

  public get gender(): PersonGenderType | undefined {
    return this._gender;
  }

}
