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
import { ClienteLocalEntity } from './cliente-local.entity';
import { CulturaEntity } from './cultura.entity';
import { SafraEntity } from './safra.entity';
import { ClienteEntity } from './cliente.entity';
import { SituacaoSafraEnum } from 'enumerates/situacao-safra-enum';

@Entity({ name: 'cliente_safra' })
export class ClienteSafraEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  identificacao: string;

  @ManyToOne(() => ClienteLocalEntity, { nullable: false })
  @JoinColumn()
  cliente: ClienteEntity;

  @ManyToOne(() => CulturaEntity, { nullable: false })
  @JoinColumn()
  cultura: CulturaEntity;

  @ManyToOne(() => SafraEntity, { nullable: false })
  @JoinColumn()
  safra: SafraEntity;

  @Column({ nullable: true })
  descricao: string;

  @Column({ nullable: true })
  dataPlatio: Date;

  @Column({ nullable: true })
  dataColheita: Date;

  @Column({ type: 'decimal', nullable: true })
  areaPlantadaHectares: number;

  @Column({ type: 'decimal', nullable: true })
  produtividadeMedia: number;

  @Column({ type: 'decimal', nullable: true })
  produtividadeConservadora: number;

  @Column({ type: 'decimal', nullable: true })
  producaoTotalEsperada: number;

  @Column({ type: 'decimal', nullable: true })
  porcentagemNitrogenados: number;

  @Column({ type: 'decimal', nullable: true })
  porcentagemFosforo: number;

  @Column({ type: 'decimal', nullable: true })
  porcentagemPotassio: number;

  @Column({ type: 'decimal', nullable: true })
  porcentagemSulfatoAmonia: number;

  @Column({ type: 'decimal', nullable: true })
  porcentagemDefensivos: number;

  @Column({ type: 'decimal', nullable: true })
  porcentagemSementes: number;

  @Column({ type: 'decimal', nullable: true })
  totalVendidoSacas: number;

  @Column({ type: 'decimal', nullable: true })
  totalVendidoPorcentagem: number;

  @Column({ type: 'decimal', nullable: true })
  valorMedioVenda: number;

  @Column({
    type: 'enum',
    enum: SituacaoSafraEnum,
    default: SituacaoSafraEnum.PLANEJANDO,
    nullable: true,
  })
  situacaoSafra: number;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;

  @ManyToOne(() => ClienteLocalEntity, { nullable: true })
  @JoinColumn()
  clienteLocal: ClienteLocalEntity;
}
