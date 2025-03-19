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
import { CompanyEntity } from 'company/infrastructure/company.entity';
import { PersonEntity } from 'person/infrastructure/person.entity';
import { CustomerEntity } from 'customer/infrastructure/entities/customer.entity';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';
import { PlanEntity } from 'plan/infrastructure/entities/plan.entity';

@Entity({ name: 'contracts' })
export class ContractEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: EntityPrimaryKey;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  @Index({ unique: true })
  identifier: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'timestamp without time zone',
  })
  startDate: Date;

  @Column({
    type: 'timestamp without time zone',
  })
  endDate: Date;

  @ManyToOne(() => PlanEntity, { nullable: false })
  @JoinColumn()
  plan: PlanEntity;

  @ManyToOne(() => CompanyEntity, { nullable: true })
  @JoinColumn()
  company: CompanyEntity;

  @ManyToOne(() => PersonEntity, { nullable: true })
  @JoinColumn()
  person: PersonEntity;

  @ManyToOne(() => CustomerEntity, { nullable: true })
  @JoinColumn()
  customer: CustomerEntity;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
