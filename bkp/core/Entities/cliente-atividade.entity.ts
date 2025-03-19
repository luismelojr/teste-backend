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
import { AtividadeEntity } from './atividade.entity';
import { ClienteEntity } from './cliente.entity';

@Entity({ name: 'cliente_atividades' })
export class ClienteAtividadeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => AtividadeEntity, { nullable: false })
  @JoinColumn()
  atividade: AtividadeEntity;

  @ManyToOne(() => ClienteEntity, { nullable: false })
  @JoinColumn()
  cliente: ClienteEntity;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;

}
