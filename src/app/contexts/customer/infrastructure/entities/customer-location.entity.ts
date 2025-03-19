import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  Index,
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
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Entity({ name: 'customer_locations' })
export class CustomerLocationEntity extends BaseEntity {
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
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'decimal', nullable: true })
  latitude: number;

  @Column({ type: 'decimal', nullable: true })
  longitude: number;

  @Column({ type: 'decimal', nullable: true })
  totalHectares: number;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
