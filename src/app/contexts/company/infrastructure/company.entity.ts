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
import { CityEntity } from 'commons/locations/city/infrastructure/city.entity';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Entity({ name: 'companies' })
export class CompanyEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: EntityPrimaryKey;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  tradeName: string;

  @Column('varchar', { length: 14, nullable: true })
  @Index({ unique: true })
  cnpj: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToOne(() => CityEntity, { nullable: true })
  @JoinColumn()
  city: CityEntity;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  email: string;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
