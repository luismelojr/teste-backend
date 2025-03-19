import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from '../infrastructure/city.entity';
import { UUID } from 'shared/types/uuid';
import { City } from 'commons/locations/city/domain/city';
import { State } from 'commons/locations/state/domain/state';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private cityRepository: Repository<CityEntity>,
  ) {
  }

  async findAll(query: string): Promise<string[]> {
    const limit = 10;

    const result = await this.cityRepository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.state', 'state')
      .select([
        'CONCAT(city.name, \' - \', state.stateCode) as name',
        'city.uuid as uuid',
      ])
      .where('city.name ILIKE :query', { query: `%${query}%` })
      .orWhere('state.name ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();

    return result;
  }

  async findOneByUuid(uuid: UUID): Promise<City | null> {
    const city = await this.cityRepository.findOne({
      where: { uuid },
      relations: ['state'],
    });

    return new City({
      id: city.id,
      uuid: city.uuid,
      name: city.name,
      state: new State({
        id: city.state.id,
        uuid: city.state.uuid,
        name: city.state.name,
        stateCode: city.state.stateCode,
      }),
    });

  }

  findOne(id: EntityPrimaryKey): Promise<CityEntity | null> {
    return this.cityRepository.findOne({
      where: { id },
      relations: ['state'],
    });
  }
}
