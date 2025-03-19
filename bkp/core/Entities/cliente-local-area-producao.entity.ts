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
import { ClienteLocalEntity } from './cliente-local.entity';
import { CulturaEntity } from './cultura.entity';

@Entity({ name: 'cliente_area_producao' })
export class ClienteLocalAreaProducaoEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ nullable: false })
  nome: string;

  @ManyToOne(() => ClienteLocalEntity, { nullable: false })
  @JoinColumn()
  clienteLocal: ClienteLocalEntity;

  @OneToOne(() => CulturaEntity, { nullable: false })
  cultura: CulturaEntity;

  @Column({ nullable: true })
  descricao: string;

  @Column({ nullable: true })
  totalHectares: number;

  @Column({ nullable: true })
  areaIrrigadaHectares: number;

  @Column({ nullable: true })
  areaSequeiroHectares: number;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
