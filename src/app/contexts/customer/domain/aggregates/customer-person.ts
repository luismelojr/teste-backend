import { UUID } from 'shared/types/uuid';
import { Person, PersonProps } from '../value-objects/person';
import { Occupation, OccupationProps } from '../value-objects/occupation';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface CustomerPersonProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  customerId?: EntityPrimaryKey;
  person: PersonProps;
  occupation: OccupationProps;

}

export class CustomerPerson {
  private readonly _id?: EntityPrimaryKey;
  private readonly _uuid?: UUID;
  private readonly _customerId?: EntityPrimaryKey;
  private readonly _person: Person;
  private readonly _occupation: Occupation;


  constructor(props: CustomerPersonProps) {
    this._id = props.id;
    this._uuid = props.uuid;
    this._customerId = props.customerId;
    this._person = new Person(props.person);
    this._occupation = new Occupation(props.occupation);
  }

  get id(): EntityPrimaryKey | undefined {
    return this._id;
  }

  get uuid(): UUID | undefined {
    return this._uuid;
  }

  get customerId(): EntityPrimaryKey | undefined {
    return this._customerId;
  }

  get person(): Person {
    return this._person;
  }

  get occupation(): Occupation {
    return this._occupation;
  }


}
