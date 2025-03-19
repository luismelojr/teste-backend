import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PersonGenderType } from 'enumerates/person-gender-type';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import { CityEntity } from 'commons/locations/city/infrastructure/city.entity';

@Entity({ name: 'pessoas' })
export class PessoaEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  nome: string;

  @Column('varchar', { length: 11, nullable: true })
  @Index({ unique: true })
  cpf: string;

  @Column({ nullable: true })
  dataNascimento: Date;

  @Column({ nullable: true })
  telefone: string;

  @Column({ nullable: true })
  email: string;

  @ManyToOne(() => CityEntity, { nullable: true })
  @JoinColumn()
  cidade: CityEntity;

  @Column({ nullable: true })
  endereco: string;

  @Column({
    type: 'enum',
    enum: PersonGenderType,
    nullable: true,
  })
  sexo: PersonGenderType;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
