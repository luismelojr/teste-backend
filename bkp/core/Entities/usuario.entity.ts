import {
  BaseEntity,
  Column,
  Entity,
  Generated, Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import { ColaboradorEntity } from './colaborador.entity';

@Entity({ name: 'usuarios' })
export class UsuarioEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  nome: string;

  @Column()
  @Index({ unique: true })
  username: string;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;

  @OneToOne(() => ColaboradorEntity, { nullable: true })
  @JoinColumn()
  colaborador: ColaboradorEntity;

}
