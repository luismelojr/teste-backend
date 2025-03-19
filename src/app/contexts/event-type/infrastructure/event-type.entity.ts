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
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Entity({ name: 'event_types' })
export class EventTypeEntity extends BaseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: EntityPrimaryKey;

    @Column()
    @Generated('uuid')
    uuid: string;

    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;

    @DeletedAt()
    deletedAt: Date;
}
