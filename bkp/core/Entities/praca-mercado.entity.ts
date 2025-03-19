import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import { PracaMercadoCotacaoEntity } from './praca-mercado-cotacao.entity';
import { PracaMercadoCidadeEntity } from './praca-mercado-cidade.entity';

@Entity({ name: 'praca_mercado' })
export class PracaMercadoEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  nome: string;

  @Column({ nullable: true})
  descricao: string;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;

  @OneToMany(() => PracaMercadoCotacaoEntity, (cotacao) => cotacao.praca)
  cotacoes: PracaMercadoCotacaoEntity[];

  @OneToMany(() => PracaMercadoCidadeEntity, (cidade) => cidade.praca)
  cidades: PracaMercadoCidadeEntity[];

}
