import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CustomerLocationRepository,
} from 'customer/infrastructure/customer-location.repository';
import {
  CustomerLocationEntity,
} from 'customer/infrastructure/entities/customer-location.entity';
import { CustomerLocation } from 'customer/domain/aggregates/custumer-location';


export class CustomerLocationRepositoryImpl implements CustomerLocationRepository {

  constructor(
    @InjectRepository(CustomerLocationEntity)
    private readonly repository: Repository<CustomerLocationEntity>,
  ) {
  }

  async findOneByUuid(uuid: string): Promise<CustomerLocation> {
    const where: any = { uuid };
    const relations = ['customer'];
    const result = await this.repository.findOne({
      where,
      relations,
    });

    return result ? this.toDomain(result) : undefined;
  }

  async toDomain(entity: CustomerLocationEntity): Promise<CustomerLocation> {
    if (!entity) return null;

    return new CustomerLocation({
      id: entity.id,
      uuid: entity.uuid,
      customerId: entity.customer?.id,
      name: entity.name,
      description: entity.description,
      address: entity.address,
      coordinates: {
        lat: entity.latitude,
        long: entity.longitude,
      },
      totalHectares: entity.totalHectares,
    });
  }


}
