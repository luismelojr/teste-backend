import { UUID } from 'shared/types/uuid';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface CropProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  name: string;
  type: CropTypeEnum;
}

export class Crop {
  private readonly _id: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _name: string;
  private readonly _type: CropTypeEnum;

  constructor(props: CropProps) {
    this._id = props.id || undefined;
    this._uuid = props.uuid || undefined;
    this._name = props.name;
    this._type = props.type;
  }

  public get id(): EntityPrimaryKey {
    return this._id;
  }

  public get uuid(): UUID {
    return this._uuid;
  }

  public get name(): string {
    return this._name;
  }

  public get type(): CropTypeEnum {
    return this._type;
  }

}
