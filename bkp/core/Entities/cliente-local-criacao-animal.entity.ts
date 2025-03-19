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

@Entity({ name: 'cliente_criacao_animal' })
export class ClienteLocalCriacaoAnimalEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  nome: string;

  @ManyToOne(() => ClienteLocalEntity, { nullable: false })
  @JoinColumn()
  clienteLocal: ClienteLocalEntity;

  @Column()
  tipoPecuaria: string;

  @Column()
  quantidadeCabecas: number;

  @Column({ type: 'decimal', nullable: true })
  pesoMedioAnimais: number;

  @Column({ nullable: true })
  descricao: string;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
