import { UUID } from 'shared/types/uuid';
import Email from 'commons/value-objects/email';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';
import { Person, PersonProps } from 'user/domain/value-objects/person';

export interface Props {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  cognitoId: string,
  username: string,
  email: string,
  person: PersonProps,
}

export class User {
  private readonly _id: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _cognitoId: UUID;
  private readonly _username: string;
  private readonly _email: Email;
  private readonly _person: Person;

  constructor(props: Props) {
    this._id = props.id || undefined;
    this._uuid = props.uuid || undefined;
    this._cognitoId = props.cognitoId;
    this._username = props.username;
    this._email = new Email(props.email);
    this._person = new Person(props.person);
  }

  static create(
    cognitoId: string,
    username: string,
    email: string,
    person: PersonProps,
  ) {
    return new User({
      cognitoId,
      username,
      email,
      person,
    });
  }

  public get id(): EntityPrimaryKey {
    return this._id;
  }

  public get uuid(): UUID {
    return this._uuid;
  }

  get cognitoId(): UUID {
    return this._cognitoId;
  }

  get username(): string {
    return this._username;
  }

  get email(): Email {
    return this._email;
  }

  get person(): Person {
    return this._person;
  }
}
