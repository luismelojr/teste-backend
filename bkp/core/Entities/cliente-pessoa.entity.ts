import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import { ClienteLocalEntity } from './cliente-local.entity';
import { PessoaEntity } from './pessoa.entity';
import { ClienteEntity } from './cliente.entity';
import { CargoEntity } from './cargo.entity';
import { FuncaoPlanoEntity } from './funcao-plano.entity';

@Entity({ name: 'cliente_pessoas' })
export class ClientePessoaEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => PessoaEntity, { nullable: true })
  @JoinColumn()
  pessoa: PessoaEntity;

  @ManyToOne(() => ClienteLocalEntity, { nullable: false })
  @JoinColumn()
  cliente: ClienteEntity;

  @ManyToMany(() => ClienteLocalEntity)
  @JoinTable()
  funcaoPlano: FuncaoPlanoEntity[];

  @ManyToOne(() => CargoEntity, { nullable: true })
  @JoinColumn()
  ocupacao: CargoEntity;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;

}
