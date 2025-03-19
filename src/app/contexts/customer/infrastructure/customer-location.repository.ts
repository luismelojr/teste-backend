import { UUID } from 'shared/types/uuid';
import { CustomerLocation } from 'customer/domain/aggregates/custumer-location';

export abstract class CustomerLocationRepository {
  abstract findOneByUuid(uuid: UUID): Promise<CustomerLocation>;
}
