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
  CultivationEntity,
} from 'commons/cultivations/infrastructure/cultivation.entity';
import {
  CustomerCropInformationEntity,
} from 'customer/infrastructure/entities/customer-crop-information.entity';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Entity({ name: 'customer_crop_information_cultivations' })
export class CustomerCropInformationCultivationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: EntityPrimaryKey;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => CultivationEntity, { nullable: false })
  @JoinColumn()
  cultivation: CultivationEntity;

  @ManyToOne(() => CustomerCropInformationEntity, { nullable: false })
  @JoinColumn()
  customerCropInformation: CustomerCropInformationEntity;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
