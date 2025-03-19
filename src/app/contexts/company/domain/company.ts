import { UUID } from 'shared/types/uuid';
import Phone from 'commons/value-objects/phone';
import Email from 'commons/value-objects/email';
import Cnpj from 'commons/value-objects/cnpj';
import CompanyCity from './value-objects/company-city';
import CompanyName from './value-objects/company-name';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface CompanyProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  name: string,
  tradeName?: string,
  cnpj: string,
  phone?: string,
  city?: { id: EntityPrimaryKey; uuid?: UUID, name?: string };
  address?: string,
  email?: string,
}

export class Company {
  private readonly _id: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _name: CompanyName;
  private readonly _tradeName: CompanyName;
  private readonly _cnpj: Cnpj;
  private readonly _phone: Phone;
  private readonly _city: CompanyCity;
  private readonly _address: string;
  private readonly _email: Email;

  constructor(props: CompanyProps) {
    this._id = props.id || undefined;
    this._uuid = props.uuid || undefined;
    this._name = new CompanyName(props.name);
    this._cnpj = new Cnpj(props.cnpj);
    this._address = props.address;

    if (props.tradeName) {
      this._tradeName = new CompanyName(props.tradeName);
    }

    if (props.city?.uuid || props.city?.id) {
      const { id: cityId, uuid: cityUuid, name: cityName } = props.city;
      this._city = new CompanyCity(cityId, cityUuid, cityName);
    } else {
      props.city = undefined;
    }

    if (props.email) {
      this._email = new Email(props.email);
    }

    if (props.phone) {
      this._phone = new Phone(props.phone);
    }

  }

  static create(
    name: string,
    tradeName: string,
    cnpj: string,
    phone: string,
    city: { id: EntityPrimaryKey },
    address: string,
    email: string,
  ) {
    return new Company({
      name,
      tradeName,
      cnpj,
      phone,
      city,
      address,
      email,
    });
  }


  get id(): EntityPrimaryKey {
    return this._id;
  }

  get uuid(): UUID {
    return this._uuid;
  }

  get name(): CompanyName {
    return this._name;
  }

  get tradeName(): CompanyName {
    return this._tradeName;
  }

  get cnpj(): Cnpj {
    return this._cnpj;
  }

  get phone(): Phone {
    return this._phone;
  }

  get city(): CompanyCity {
    return this._city;
  }

  get address(): string {
    return this._address;
  }

  get email(): Email {
    return this._email;
  }
}
