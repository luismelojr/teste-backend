import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstadoEntity } from './estado.entity';

@Entity({ name: 'cidades' })
export class CidadeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => EstadoEntity, { nullable: false })
  estado: EstadoEntity;
}
