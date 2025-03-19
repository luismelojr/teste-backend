import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { PersonEntity } from './person.entity';
import { PersonRepository } from './person.repository';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import { Person } from '../domain/person';
import { CityEntity } from 'commons/locations/city/infrastructure/city.entity';
import { State } from 'commons/locations/state/domain/state';
import { City } from 'commons/locations/city/domain/city';
import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export class PersonRepositoryImpl
  implements PersonRepository {
  constructor(
    @InjectRepository(PersonEntity)
    protected readonly repository: Repository<PersonEntity>,
  ) {
  }

  async create(person: Person): Promise<Person> {
    const entity = new PersonEntity();
    entity.name = person.name.getValue();
    entity.cpf = person.cpf.getValue();
    entity.phone = person.phone?.getValue();
    entity.address = person.address;
    entity.gender = person.gender;

    if (person.city) {
      entity.city = { id: person.city.id } as CityEntity;
    }

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(person: Person): Promise<Person> {
    const entityToSave = new PersonEntity();
    entityToSave.id = person.id;
    entityToSave.uuid = person.uuid;
    entityToSave.name = person.name.getValue();
    entityToSave.cpf = person.cpf.getValue();
    entityToSave.phone = person.phone?.getValue();
    entityToSave.address = person.address;
    entityToSave.gender = person.gender;

    if (person.city) {
      entityToSave.city = { id: person.city.id } as CityEntity;
    }

    const updated = await this.repository.save(entityToSave);
    return this.toDomain(updated);
  }

  async delete(uuid: UUID): Promise<void> {
    const entity = await this.repository.findOne({
      where: { uuid },
    });

    entity.cpf = null;

    await this.repository.save(entity);
    await this.repository.softDelete(entity.id);
  }

  async findOneById(id: EntityPrimaryKey): Promise<Person> {
    const where: any = { id };
    const relations = ['city', 'city.state'];
    const result = await this.repository.findOne({
      where,
      relations,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findOneByUuid(uuid: string): Promise<Person> {
    const where: any = { uuid };
    const relations = ['city', 'city.state'];
    const result = await this.repository.findOne({
      where,
      relations,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async findAll({ pagination, searchText }: {
    pagination: PaginationInput,
    searchText?: string,
  }): Promise<PaginationOutput<Person>> {
    const conditions: any[] = [];
    const relations = ['city', 'city.state'];

    if (searchText) {
      conditions.push(
        { name: ILike(`%${searchText}%`) },
        { cpf: ILike(`%${searchText}%`) },
        { phone: ILike(`%${searchText}%`) },
        { address: ILike(`%${searchText}%`) },
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
      .createQueryBuilder('person')
      .select([
        'CONCAT(person.name, \' - \', person.cpf) as name',
        'person.uuid as uuid',
      ])
      .where('person.name ILIKE :query', { query: `%${query}%` })
      .orWhere('person.cpf ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();

    return result;
  }

  private toDomain(entity: PersonEntity): Person {
    const city = entity.city;
    const state = city?.state;

    return new Person({
      id: entity.id,
      uuid: entity.uuid,
      name: entity.name,
      cpf: entity.cpf,
      phone: entity.phone,
      city: city ? new City({
        id: city?.id,
        uuid: city?.uuid,
        name: city?.name,
        state: state ? new State({
          id: state?.id,
          uuid: state?.uuid,
          name: state?.name,
          stateCode: state?.stateCode,
        }) : undefined,
      }) : undefined,
      address: entity.address,
      gender: entity.gender,
    });
  }

}

