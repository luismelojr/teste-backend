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
import { PracaMercadoEntity } from './praca-mercado.entity';
import { CulturaEntity } from './cultura.entity';

@Entity({ name: 'praca_mercado_cotacoes' })
export class PracaMercadoCotacaoEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  nome: string;

  @ManyToOne(() => PracaMercadoEntity)
  @JoinColumn()
  praca: PracaMercadoEntity;

  @OneToOne(() => CulturaEntity)
  @JoinColumn()
  cultura: CulturaEntity;

  @Column({ nullable: true })
  descricao: string;

  @Column({ nullable: true })
  valor: number;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
