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
import { PlanEntity } from 'plan/infrastructure/entities/plan.entity';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Entity({ name: 'plan_functions' })
export class PlanFunctionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: EntityPrimaryKey;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  name: string;

  @ManyToOne(() => PlanEntity, { nullable: false })
  @JoinColumn()
  plan: PlanEntity;

  @Column({nullable: true})
  description: string;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
