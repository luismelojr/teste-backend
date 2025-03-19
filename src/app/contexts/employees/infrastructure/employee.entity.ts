import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContractTypeInterface } from '../@types/ContractTypeInterface';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';

@Entity('employees')
export class EmployeeEntity extends BaseEntity{
  @PrimaryGeneratedColumn('increment', {type: 'bigint'})
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  business_phone: string;

  @Column()
  business_email: string;

  @Column()
  occupation: string;

  @Column()
  start_date: Date;

  @Column({type: 'enum', enum: ['CLT', 'CNPJ', 'Estágio', 'Experiência']})
  contract_type: ContractTypeInterface;

  @Column({ nullable: true })
  shutdown_date: Date;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
