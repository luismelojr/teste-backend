import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';

@Entity({ name: 'customers__' })
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ unique: true })
  identifier: string;

  @Column({ nullable: true })
  group_identifier: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'boolean', nullable: true })
  financial_tools: boolean;

  @Column({ type: 'boolean', nullable: true })
  grain_consumer: boolean;

  @Column({ type: 'boolean', nullable: true })
  own_grain?: boolean;

  @Column({ type: 'numeric', nullable: true })
  annual_quantity?: number;

  @Column({ type: 'boolean', nullable: true })
  receive_third_grains?: boolean;

  @Column({ type: 'boolean', nullable: true })
  receives_land_rent: boolean;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
