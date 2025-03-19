import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'estados' })
export class EstadoEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ length: 255 })
  @Index({ unique: true })
  name: string;

  @Column({ nullable: true, length: 2, default: null })
  @Index({ unique: true })
  sigla: string;
}
