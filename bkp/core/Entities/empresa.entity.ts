import {
  BaseEntity,
  Column,
  Entity,
  Generated, Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import { CityEntity } from 'commons/locations/city/infrastructure/city.entity';

@Entity({ name: 'empresas' })
export class EmpresaEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  razaoSocial: string;

  @Column({ nullable: true})
  nomeFantasia: string;

  @Column('varchar', { length: 11, nullable: true })
  @Index({ unique: true })
  cnpj: string;

  @Column({ nullable: true })
  telefone: string;

  @ManyToOne(() => CityEntity, { nullable: true })
  @JoinColumn()
  cidade: CityEntity;

  @Column({ nullable: true })
  endereco: string;

  @Column({ nullable: true })
  email: string;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
