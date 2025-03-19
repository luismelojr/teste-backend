import { UUID } from 'shared/types/uuid';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';


export interface CropProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  name?: string;
  type: CropTypeEnum;
  start?: number;
  end?: number;
}

export class Crop {
  private readonly _id: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _name: string;
  private readonly _type: CropTypeEnum;
  private readonly _start: number;
  private readonly _end: number;

  constructor(props: CropProps) {
    this._id = props.id || undefined;
    this._uuid = props.uuid || undefined;
    this._name = props.name
    this._type = props.type;
    this._start = props.start;
    this._end = props.end;
  }

  static create({ type, start, end, name }: Omit<CropProps, 'id' | 'uuid'>): Crop {
    return new Crop({
      type,
      start,
      end,
      name
    });
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

  public get start(): number {
    return this._start;
  }

  public get end(): number {
    return this._end;
  }
}
