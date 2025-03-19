import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import {
  CityEntity,
} from 'commons/locations/city/infrastructure/city.entity';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Entity({ name: 'persons' })
export class PersonEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: EntityPrimaryKey;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column('varchar', { length: 11, nullable: true })
  cpf: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToOne(() => CityEntity, { nullable: true })
  @JoinColumn()
  city: CityEntity;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: PersonGenderType,
    nullable: true,
  })
  gender: PersonGenderType;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
