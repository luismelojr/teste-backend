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
import { ClienteEntity } from './cliente.entity';
import { CulturaEntity } from './cultura.entity';

@Entity({ name: 'clientes_informacoes_safras' })
export class ClienteInformacoesSafraEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => ClienteEntity, { nullable: false })
  @JoinColumn()
  cliente: ClienteEntity;

  @Column()
  tipoSafra: string;

  @Column({ nullable: true })
  epocaPlatioInicio: Date;

  @Column({ nullable: true })
  epocaPlatioFim: Date;

  @Column({ nullable: true })
  epocaColeitaInicio: Date;

  @Column({ nullable: true })
  epocaColeitaFim: Date;

  @ManyToMany(() => CulturaEntity)
  @JoinTable()
  culturas: CulturaEntity[];

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;


}
