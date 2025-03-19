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
import { ClienteEntity } from './cliente.entity';
import { TipoCompromissoEntity } from './tipo-compromisso.entity';

@Entity({ name: 'clientes_compromissos' })
export class ClienteAnotacoesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => ClienteEntity)
  @JoinColumn()
  cliente: ClienteEntity;

  @ManyToOne(() => TipoCompromissoEntity)
  @JoinColumn()
  tipoCompromisso: TipoCompromissoEntity;

  @Column()
  descricao: string;

  @Column()
  dataCompromisso: Date;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;


}
