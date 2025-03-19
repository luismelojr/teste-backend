import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import {
  CustomerEntity,
} from 'customer/infrastructure/entities/customer.entity';
import { ActivityEntity } from 'activity/infrastructure/activity.entity';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Entity({ name: 'customer_activities' })
export class CustomerActivityEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: EntityPrimaryKey;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => CustomerEntity, { nullable: false })
  @JoinColumn()
  customer: CustomerEntity;

  @ManyToOne(() => ActivityEntity, { nullable: false })
  @JoinColumn()
  activity: ActivityEntity;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
