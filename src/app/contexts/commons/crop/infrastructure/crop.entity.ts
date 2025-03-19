import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAt } from 'shared/decorators/created-at.decorator';
import { UpdatedAt } from 'shared/decorators/updated-at.decorator';
import { DeletedAt } from 'shared/decorators/deleted-at.decorator';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Entity({ name: 'crops' })
export class CropEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: EntityPrimaryKey;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: CropTypeEnum,
    default: CropTypeEnum.SUMMER,
  })
  type: CropTypeEnum;

  @Column({ type: 'integer' })
  start: number;

  @Column({ type: 'integer' })
  end: number;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  @DeletedAt()
  deletedAt: Date;
}
