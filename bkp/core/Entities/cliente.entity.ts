import {
  BaseEntity,
  Column,
  Entity,
  Generated, Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import { ClienteLocalEntity } from './cliente-local.entity';

@Entity({ name: 'clientes' })
export class ClienteEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  identificacao: string;

  @Column()
  @Index({ unique: true })
  identificacaoGrupo: string;

  @Column({ nullable: true })
  descricao: string;

  @Column({default: false})
  utilizaFerramentasFinanceiras: boolean;

  @Column({ default: false})
  consumidorGraos: boolean;

  @Column({ nullable: true })
  origemGrao: string;

  @Column({ type: 'decimal', nullable: true })
  volumeAnual: number;

  @Column({ default: false})
  recebeGraoTerceiros: boolean;

  @Column({ default: false})
  recebeArrendamentoTerra: boolean;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;

  @OneToMany(() => ClienteLocalEntity, (clienteLocal) => clienteLocal.cliente)
  locais: ClienteLocalEntity[];

}
