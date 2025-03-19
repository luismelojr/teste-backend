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
import { OccupationEntity } from 'occupation/infrastructure/occupation.entity';
import { PersonEntity } from 'person/infrastructure/person.entity';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Entity({ name: 'customer_persons' })
export class CustomerPersonEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: EntityPrimaryKey;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => CustomerEntity, { nullable: false })
  @JoinColumn()
  customer: CustomerEntity;

  @ManyToOne(() => PersonEntity, { nullable: false })
  @JoinColumn()
  person: PersonEntity;

  @ManyToOne(() => OccupationEntity, { nullable: false })
  @JoinColumn()
  occupation: OccupationEntity;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
