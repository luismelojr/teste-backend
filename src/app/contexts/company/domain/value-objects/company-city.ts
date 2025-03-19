import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export default class CompanyCity {
  private id: EntityPrimaryKey;
  private uuid: string;
  private name: string;

  constructor(id: EntityPrimaryKey, uuid: string, name: string) {
    if (!id) throw 'id is required';

    this.id = id;
    this.uuid = uuid;
    this.name = name;
  }

  getId(): EntityPrimaryKey {
    return this.id;
  }

  getUuid(): string {
    return this.uuid;
  }

  getName(): string {
    return this.name;
  }
}
