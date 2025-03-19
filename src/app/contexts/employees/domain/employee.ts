import { UUID } from 'shared/types/uuid';
import Phone from 'commons/value-objects/phone';
import Email from 'commons/value-objects/email';
import { ContractTypeInterface } from '../@types/ContractTypeInterface';

interface EmployeeProps {
  id?: number;
  uuid?: UUID;
  business_phone: string;
  business_email: string;
  occupation: string;
  start_date: Date;
  contract_type: ContractTypeInterface;
  shutdown_date?: Date;
}

export class Employee {
  private readonly _id: number;
  private readonly _uuid: UUID;
  private readonly _business_phone: Phone;
  private readonly _business_email: Email;
  private readonly _occupation: string;
  private readonly _start_date: Date;
  private readonly _contract_type: ContractTypeInterface;
  private readonly _shutdown_date?: Date;

  constructor(props: EmployeeProps) {
    this._id = props.id || undefined;
    this._uuid = props.uuid || undefined;
    this._business_phone = new Phone(props.business_phone);
    this._business_email = new Email(props.business_email);
    this._occupation = props.occupation;
    this._start_date = props.start_date;
    this._contract_type = props.contract_type;
    this._shutdown_date = props.shutdown_date;
  }

  static create ({business_phone, business_email, contract_type, shutdown_date, occupation, start_date}: Omit<EmployeeProps, 'id' | 'uuid'>) {
    return new Employee({
      business_phone,
      business_email,
      contract_type,
      shutdown_date,
      occupation,
      start_date,
    });
  }

  get id() {
    return this._id;
  }

  get uuid() {
    return this._uuid;
  }

  get business_phone() {
    return this._business_phone;
  }

  get business_email() {
    return this._business_email;
  }

  get occupation() {
    return this._occupation;
  }

  get start_date() {
    return this._start_date;
  }

  get contract_type() {
    return this._contract_type;
  }

  get shutdown_date() {
    return this._shutdown_date;
  }
}
