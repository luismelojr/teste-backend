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
import { ClienteLocalEntity } from './cliente-local.entity';
import { CulturaEntity } from './cultura.entity';

@Entity({ name: 'cliente_local_armazenamento' })
export class ClienteLocalArmazenamentoEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao: string;

  @Column()
  estruturaArmazenagem: string;

  @ManyToOne(() => ClienteLocalEntity, { nullable: false })
  @JoinColumn()
  clienteLocal: ClienteLocalEntity;

  @ManyToOne(() => CulturaEntity, { nullable: false })
  @JoinColumn()
  cultura: CulturaEntity;

  @Column({ type: 'decimal', nullable: true })
  capacidadeTotal: number;

  @Column({ type: 'decimal', nullable: true })
  lotacaoAtual: number;

  @Column({ type: 'decimal', nullable: true })
  lotacaoAtualPorcentagem: number;

  @Column({ type: 'decimal', nullable: true })
  custoArmazenagem: number;

  @Column({ default: false })
  localProprio: boolean;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
