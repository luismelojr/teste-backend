import { UUID } from 'shared/types/uuid';
import { Cultivation, CultivationProps } from '../value-objects/cultivation';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface CustomerCropInformationCultivationProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  customerCropInformationId?: EntityPrimaryKey;
  cultivation: CultivationProps;
}

export class CustomerCropInformationCultivation {
  private readonly _id?: EntityPrimaryKey;
  private readonly _uuid: UUID;
  private readonly _customerCropInformationId?: EntityPrimaryKey;
  private readonly _cultivation: Cultivation;

  constructor(props: CustomerCropInformationCultivationProps) {
    this._id = props.id;
    this._uuid = props.uuid;
    this._customerCropInformationId = props.customerCropInformationId;
    this._cultivation = new Cultivation(props.cultivation);
  }

  get id(): EntityPrimaryKey | undefined {
    return this._id;
  }

  get uuid(): UUID {
    return this._uuid;
  }

  get customerCropInformationId(): EntityPrimaryKey {
    return this._customerCropInformationId;
  }

  get cultivation(): Cultivation {
    return this._cultivation;
  }
}
