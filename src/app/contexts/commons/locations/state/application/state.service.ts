import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StateEntity } from '../infrastructure/state.entity';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(StateEntity)
    private stateRepository: Repository<StateEntity>,
  ) {}

  async findAll(query: string): Promise<string[]> {
    const limit = 10;

    return await this.stateRepository
      .createQueryBuilder('state')
      .select([
        "CONCAT(state.name, ' - ', state.stateCode) as name",
        'state.uuid as uuid',
      ])
      .where('state.name ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();
  }

  findOne(id: EntityPrimaryKey): Promise<StateEntity | null> {
    return this.stateRepository.findOne({
      where: { id },
      relations: ['state'],
    });
  }
}
