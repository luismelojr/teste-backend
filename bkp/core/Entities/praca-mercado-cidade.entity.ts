import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import { CidadeEntity } from './cidade.entity';
import { PracaMercadoEntity } from './praca-mercado.entity';

@Entity({ name: 'praca_mercado_cidades' })
export class PracaMercadoCidadeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @OneToOne(() => CidadeEntity)
  @JoinColumn()
  cidade: CidadeEntity;

  @ManyToOne(() => PracaMercadoEntity)
  @JoinColumn()
  praca: PracaMercadoEntity;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;

}
