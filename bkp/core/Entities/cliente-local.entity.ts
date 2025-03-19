import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import { ClienteEntity } from './cliente.entity';
import {
  ClienteLocalAreaProducaoEntity,
} from './cliente-local-area-producao.entity';
import { CidadeEntity } from './cidade.entity';

@Entity({ name: 'cliente_local' })
export class ClienteLocalEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao: string;

  @Column({ nullable: true })
  endereco: string;

  @OneToOne(() => CidadeEntity, { nullable: true })
  cidade: CidadeEntity[];

  @ManyToOne(() => ClienteEntity, { nullable: false })
  @JoinColumn()
  cliente: ClienteEntity;

  @Column({ type: 'decimal', nullable: true })
  lat: number;

  @Column({ type: 'decimal', nullable: true })
  long: number;

  @Column({ type: 'decimal', nullable: true })
  tamanho_hectares: number;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;

  @OneToMany(() => ClienteLocalAreaProducaoEntity, (areaProducao) => areaProducao.clienteLocal)
  locais: ClienteLocalAreaProducaoEntity[];

}
