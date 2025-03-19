import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Entity({ name: 'states' })
export class StateEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: EntityPrimaryKey;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ length: 255 })
  @Index({ unique: true })
  name: string;

  @Column({ nullable: true, length: 2, default: null })
  @Index({ unique: true })
  stateCode: string;
}
