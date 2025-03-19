import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { User } from '../domain/user';
import { UUID } from 'shared/types/uuid';
import { PersonEntity } from 'person/infrastructure/person.entity';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export class UserRepositoryImpl
  implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly repository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(user: User): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entity = new UserEntity();
      entity.cognitoId = user.cognitoId;
      entity.username = user.username;
      entity.email = user.email.getValue();

      let personEntity: PersonEntity;

      if (user.person?.id) {
        personEntity = await queryRunner.manager.findOne(PersonEntity, {
          where: { id: user.person.id },
        });

        if (!personEntity) {
          return null;
        }
      } else {
        personEntity = new PersonEntity();
        personEntity.name = user.person.name.getValue();
        personEntity.cpf = user.person.cpf.getValue();

        personEntity = await queryRunner.manager.save(personEntity);
      }

      entity.person = personEntity;

      const savedUser = await queryRunner.manager.save(entity);

      await queryRunner.commitTransaction();
      return this.findOneById(savedUser.id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(user: User): Promise<User> {
    const entityToSave = new UserEntity();
    entityToSave.id = user.id;
    entityToSave.uuid = user.uuid;
    entityToSave.cognitoId = user.cognitoId;
    entityToSave.username = user.username;
    entityToSave.email = user.email.getValue();
    entityToSave.person = {
      id: user.person.id,
      uuid: user.person.uuid,
      name: user.person.name.getValue(),
      cpf: user.person.cpf.getValue(),
    } as PersonEntity;

    const updated = await this.repository.save(entityToSave);
    return this.findOneById(updated.id);
  }

  async delete(uuid: UUID): Promise<void> {
    const entity = await this.repository.findOne({
      where: { uuid },
    });

    await this.repository.softDelete(entity.id);
  }

  async findOneByUsername(email: string): Promise<User> {
    const where: any = { email };
    const relations = ['person'];
    const result = await this.repository.findOne({
      where,
      relations,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findOneById(id: EntityPrimaryKey): Promise<User> {
    const where: any = { id };
    const relations = ['person'];
    const result = await this.repository.findOne({
      where,
      relations,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findOneByUuid(uuid: string): Promise<User> {
    const where: any = { uuid };
    const relations = ['person'];
    const result = await this.repository.findOne({
      where,
      relations,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<User>> {
    const conditions: any[] = [];
    const relations = ['person'];

    if (searchText) {
      conditions.push(
        { username: ILike(`%${searchText}%`) },
        { email: ILike(`%${searchText}%`) },
      );
    }

    const [results, total] = await this.repository.findAndCount({
      where: conditions,
      relations,
      order: {
        updatedAt: 'DESC',
      },
      take: pagination.maxPageSize,
      skip: pagination.maxPageSize * (pagination.page - 1),
    });

    const data = results.map((raw) => this.toDomain(raw));

    return {
      data,
      total,
    };
  }

  async findAutocomplete(query: string): Promise<any[]> {
    const limit = 10;

    const result = await this.repository
      .createQueryBuilder('user')
      .select([
        'CONCAT(user.username, \'(\', user.email,\')\') as name',
        'user.uuid as uuid',
      ])
      .where('user.username ILIKE :query', { query: `%${query}%` })
      .orWhere('user.email ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();

    return result;
  }

  private toDomain(entity: UserEntity): User {
    const person = entity.person;
    return new User({
      id: entity.id,
      uuid: entity.uuid,
      cognitoId: entity.cognitoId,
      username: entity.username,
      email: entity.email,
      person: {
        id: person.id,
        uuid: person.uuid,
        name: person.name,
        cpf: person.cpf,
      },
    });
  }

}

