import { UUID } from 'shared/types/uuid';
import { Activity, ActivityProps } from '../value-objects/activity';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface CustomerActivityProps {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  customerId?: EntityPrimaryKey;
  activity: ActivityProps;
}

export class CustomerActivity {
  private readonly _id?: EntityPrimaryKey;
  private readonly _uuid?: UUID;
  private readonly _customerId?: EntityPrimaryKey;
  private readonly _activity: Activity;


  constructor(props: CustomerActivityProps) {
    this._id = props.id;
    this._uuid = props.uuid;
    this._customerId = props.customerId;
    this._activity = new Activity(props.activity);

  }

  get id(): EntityPrimaryKey | undefined {
    return this._id;
  }

  get uuid(): UUID {
    return this._uuid;
  }

  get customerId(): EntityPrimaryKey {
    return this._customerId;
  }

  get activity(): Activity {
    return this._activity;
  }

}
