import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import {
  CustomerEntity,
} from 'customer/infrastructure/entities/customer.entity';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import {
  CustomerCropInformationCultivationEntity,
} from 'customer/infrastructure/entities/customer-crop-information-cultivation.entity';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Entity({ name: 'customer_crop_information' })
export class CustomerCropInformationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: EntityPrimaryKey;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => CustomerEntity, { nullable: false })
  @JoinColumn()
  customer: CustomerEntity;

  @Column({
    type: 'enum',
    enum: CropTypeEnum,
    default: CropTypeEnum.SUMMER,
  })
  typeCrop: CropTypeEnum;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
  })
  plantingSeasonStart: Date;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
  })
  plantingSeasonEnd: Date;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
  })
  harvestSeasonStart: Date;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
  })
  harvestSeasonEnd: Date;

  @OneToMany(() => CustomerCropInformationCultivationEntity,
    (cropCultivation) => cropCultivation.customerCropInformation,
    { cascade: ['insert'] })
  cultivations: CustomerCropInformationCultivationEntity[];

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
