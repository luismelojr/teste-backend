import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne, OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import { PessoaEntity } from './pessoa.entity';
import { TipoContratacaoEnum } from 'enumerates/tipo-contratacao-enum';
import { UsuarioEntity } from './usuario.entity';

@Entity({ name: 'colaboradores' })
export class ColaboradorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => PessoaEntity, { nullable: true })
  @JoinColumn()
  pessoa: PessoaEntity;

  @Column({ nullable: true })
  telefoneComercial: string;

  @Column({ nullable: true })
  emailComercial: string;

  @Column({ nullable: true })
  cargo: string;

  @Column({ nullable: true })
  dataInicio: Date;

  @Column({
    type: 'enum',
    enum: TipoContratacaoEnum,
    nullable: true,
  })
  tipoContratacao: string;

  @Column({ nullable: true })
  dataDesligamento: Date;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;

  @OneToOne(() => UsuarioEntity, { nullable: true })
  @JoinColumn()
  usuario: UsuarioEntity;

}
