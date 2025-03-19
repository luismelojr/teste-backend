import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import {
  CustomerLocationEntity,
} from 'customer/infrastructure/entities/customer-location.entity';
import {
  CustomerPersonEntity,
} from 'customer/infrastructure/entities/customer-person.entity';
import {
  CustomerActivityEntity,
} from 'customer/infrastructure/entities/customer-activity.entity';
import {
  CustomerCropInformationEntity,
} from 'customer/infrastructure/entities/customer-crop-information.entity';
import {
  CustomerCropEntity,
} from 'customer/infrastructure/entities/customer-crop.entity';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Entity({ name: 'customers' })
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: EntityPrimaryKey;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  @Index({ unique: true })
  identifier: string;

  @Column()
  groupIdentifier: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  financialTools: boolean;

  @Column({ default: false })
  receivesLandRent: boolean;

  @Column({ default: false })
  grainConsumer: boolean;

  @Column({ default: false })
  ownGrain: boolean;

  @Column({ default: 0 })
  annualQuantity: number;

  @Column({ default: false })
  receiveThirdGrains: boolean;

  @OneToMany(() => CustomerLocationEntity,
    (location) => location.customer,
    { cascade: true, orphanedRowAction: 'soft-delete', onDelete: 'CASCADE' })
  locations: CustomerLocationEntity[];

  @OneToMany(() => CustomerActivityEntity,
    (activity) => activity.customer,
    { cascade: true, orphanedRowAction: 'soft-delete' })
  activities: CustomerActivityEntity[];

  @OneToMany(() => CustomerPersonEntity,
    (person) => person.customer,
    { cascade: true, orphanedRowAction: 'soft-delete' })
  persons: CustomerPersonEntity[];

  @OneToMany(() => CustomerCropInformationEntity,
    (cropInformation) => cropInformation.customer,
    { cascade: true, orphanedRowAction: 'soft-delete' })
  cropInformation: CustomerCropInformationEntity[];

  @OneToMany(() => CustomerCropEntity,
    (crop) => crop.customer,
    { cascade: true, orphanedRowAction: 'soft-delete' })
  crops: CustomerCropEntity[];

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
