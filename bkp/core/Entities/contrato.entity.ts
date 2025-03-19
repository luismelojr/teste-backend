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
import { ClienteEntity } from './cliente.entity';
import { EmpresaEntity } from './empresa.entity';
import { PessoaEntity } from './pessoa.entity';
import { PlanoEntity } from './plano.entity';

@Entity({ name: 'contratos' })
export class ContratoEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  identificador: string;

  @Column({ nullable: true })
  descricao: string;

  @ManyToOne(() => ClienteEntity, { nullable: false })
  @JoinColumn()
  cliente: ClienteEntity;

  @OneToOne(() => EmpresaEntity, { nullable: true })
  @JoinColumn()
  empresa: EmpresaEntity;

  @OneToOne(() => PessoaEntity, { nullable: true })
  @JoinColumn()
  pessoaResponsavel: PessoaEntity;

  @OneToOne(() => PlanoEntity, { nullable: false })
  @JoinColumn()
  plano: PlanoEntity;

  @Column({ nullable: true })
  dataInicio: Date;

  @Column({ nullable: true })
  dataFim: Date;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
