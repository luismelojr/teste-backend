import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import {
  CustomerEntity,
} from 'customer/infrastructure/entities/customer.entity';
import { CropCustomerStatusEnum } from 'enumerates/crop-customer-status.enum';
import {
  CultivationEntity,
} from 'commons/cultivations/infrastructure/cultivation.entity';
import { CropEntity } from 'commons/crop/infrastructure/crop.entity';
import {
  CustomerLocationEntity,
} from 'customer/infrastructure/entities/customer-location.entity';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Entity({ name: 'customer_crops' })
export class CustomerCropEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: EntityPrimaryKey;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => CustomerEntity, { nullable: false })
  @JoinColumn()
  customer: CustomerEntity;

  @Column()
  @Index({ unique: true })
  identification: string;

  @Column({
    type: 'enum',
    enum: CropCustomerStatusEnum,
    default: CropCustomerStatusEnum.PLANTED,
  })
  status: CropCustomerStatusEnum;

  @ManyToOne(() => CultivationEntity, { nullable: false })
  @JoinColumn()
  cultivation: CultivationEntity;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
  })
  plantingDate: Date;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
  })
  harvestDate: Date;

  @Column({ type: 'decimal', nullable: true })
  plantedAreaHectares: number;

  @Column({ type: 'decimal', nullable: true })
  averageProductivity: number;

  @Column({ type: 'decimal', nullable: true })
  conservativeProductivity: number;

  @Column({ type: 'decimal', nullable: true })
  expectedTotalProduction: number;

  @Column({ type: 'decimal', nullable: true })
  nitrogenPercentage: number;

  @Column({ type: 'decimal', nullable: true })
  phosphorusPercentage: number;

  @Column({ type: 'decimal', nullable: true })
  potassiumPercentage: number;

  @Column({ type: 'decimal', nullable: true })
  ammoniumSulfatePercentage: number;

  @Column({ type: 'decimal', nullable: true })
  defensivePercentage: number;

  @Column({ type: 'decimal', nullable: true })
  seedPercentage: number;

  @Column({ type: 'decimal', nullable: true })
  totalSoldBags: number;

  @Column({ type: 'decimal', nullable: true })
  totalSoldPercentage: number;

  @Column({ type: 'decimal', nullable: true })
  averageSalesValue: number;

  @ManyToOne(() => CropEntity, { nullable: false })
  @JoinColumn()
  crop: CropEntity;

  @ManyToMany(() => CustomerLocationEntity)
  @JoinTable()
  locations: CustomerLocationEntity[];

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
