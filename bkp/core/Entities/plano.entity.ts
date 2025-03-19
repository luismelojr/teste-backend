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
import { FuncaoPlanoEntity } from './funcao-plano.entity';

@Entity({ name: 'planos' })
export class PlanoEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  @Index({ unique: true })
  nome: string;

  @Column({ nullable: true})
  descricao: string;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;

  @OneToMany(() => FuncaoPlanoEntity, (funcao) => funcao.plano)
  funcoes: FuncaoPlanoEntity[];
}
