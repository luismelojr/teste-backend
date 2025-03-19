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
import { PersonEntity } from 'person/infrastructure/person.entity';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: EntityPrimaryKey;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  cognitoId: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @ManyToOne(() => PersonEntity)
  @JoinColumn({ name: 'person_id' })
  person: PersonEntity;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
