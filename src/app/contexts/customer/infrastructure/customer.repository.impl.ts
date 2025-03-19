import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, QueryRunner, Repository } from 'typeorm';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput,
} from 'shared/abstracts/paginations/pagination.output';
import {
  CustomerEntity,
} from 'customer/infrastructure/entities/customer.entity';
import {
  CustomerRepository,
} from 'customer/infrastructure/customer.repository';
import { Customer } from 'customer/domain/customer';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';
import {
  ToEntityAdapter,
} from 'customer/infrastructure/adapters/to-entity.adapter';
import {
  ToDomainAdapter,
} from 'customer/infrastructure/adapters/to-domain.adapter';
import {
  CustomerTransaction,
} from 'customer/infrastructure/customer.transaction';
import {
  CustomerCropEntity,
} from 'customer/infrastructure/entities/customer-crop.entity';
import {
  CustomerActivityEntity,
} from 'customer/infrastructure/entities/customer-activity.entity';
import {
  CustomerCropInformationEntity,
} from 'customer/infrastructure/entities/customer-crop-information.entity';
import {
  CustomerPersonEntity,
} from 'customer/infrastructure/entities/customer-person.entity';
import { CustomerActivity } from 'customer/domain/aggregates/customer-activity';
import { CustomerCrop } from 'customer/domain/aggregates/customer-crop';
import {
  CustomerCropInformation,
} from 'customer/domain/aggregates/customer-crop-information';
import { CustomerPerson } from 'customer/domain/aggregates/customer-person';
import {
  CustomerCropInformationCultivation,
} from 'customer/domain/aggregates/customer-crop-information-cultivation';
import {
  CustomerCropInformationCultivationEntity,
} from 'customer/infrastructure/entities/customer-crop-information-cultivation.entity';

export const CUSTOMER_RELATIONS = [
  'locations',
  'activities',
  'activities.activity',
  'persons',
  'persons.person',
  'persons.occupation',
  'cropInformation',
  'cropInformation.cultivations.cultivation',
  'crops',
  'crops.crop',
  'crops.cultivation',
  'crops.locations',
];

export class CustomerRepositoryImpl implements CustomerRepository {

  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
    @InjectRepository(CustomerActivityEntity)
    private readonly customerActivityRepository: Repository<CustomerActivityEntity>,
    @InjectRepository(CustomerCropEntity)
    private readonly customerCropRepository: Repository<CustomerCropEntity>,
    @InjectRepository(CustomerPersonEntity)
    private readonly customerPersonRepository: Repository<CustomerPersonEntity>,
    @InjectRepository(CustomerCropInformationEntity)
    private readonly customerCropInformationRepository: Repository<CustomerCropInformationEntity>,
    @InjectRepository(CustomerCropInformationCultivationEntity)
    private readonly customerCropInfoCultivationEntityRepository: Repository<CustomerCropInformationCultivationEntity>,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(customer: Customer): Promise<Customer> {
    const entity = ToEntityAdapter.execute(customer);
    const saved = await this.repository.save(entity);
    return this.findOneById(saved.id);
  }

  async update(customer: Customer): Promise<Customer> {
    const entity = ToEntityAdapter.execute(customer);

    const existingCustomer = await this.repository.findOne({
      where: { uuid: customer.uuid },
      relations: CUSTOMER_RELATIONS,
    });

    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await CustomerTransaction.handleSoftDeletes(entity, existingCustomer, queryRunner);
      const saved = await CustomerTransaction.saveCustomerToUpdate(entity, existingCustomer, queryRunner);

      await queryRunner.commitTransaction();
      return this.findOneById(saved.id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(uuid: UUID): Promise<void> {
    const existingCustomer = await this.repository.findOne({
      where: { uuid },
      relations: CUSTOMER_RELATIONS,
    });

    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      for (const crop of existingCustomer.crops) {
        await queryRunner.manager
          .createQueryBuilder()
          .relation(CustomerCropEntity, 'locations')
          .of(crop)
          .remove(crop.locations);
      }

      await CustomerTransaction.handleSoftDeletes(existingCustomer, existingCustomer, queryRunner);
      await queryRunner.manager.softRemove(existingCustomer);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOneById(id: EntityPrimaryKey): Promise<Customer> {
    const where: any = { id };
    const relations = CUSTOMER_RELATIONS;
    const result = await this.repository.findOne({
      where,
      relations,
    });

    return result ? ToDomainAdapter.execute(result) : undefined;
  }

  async findOneByUuid(uuid: string): Promise<Customer> {
    const where: any = { uuid };
    const relations = CUSTOMER_RELATIONS;
    const result = await this.repository.findOne({
      where,
      relations,
    });

    return result ? ToDomainAdapter.execute(result) : undefined;
  }

  async findAll({
                  pagination,
                  searchText,
                }: {
    pagination: PaginationInput;
    searchText?: string;
  }): Promise<PaginationOutput<Customer>> {
    const conditions: any = [];
    const relations = CUSTOMER_RELATIONS;

    if (searchText) {
      conditions.push({ identifier: ILike(`%${searchText}%`) });
      conditions.push({ groupIdentifier: ILike(`%${searchText}%`) });
    }

    const [results, total] = await this.repository.findAndCount({
      where: conditions,
      relations: relations,
      order: { updatedAt: 'DESC' },
      take: pagination.maxPageSize,
      skip: pagination.maxPageSize * (pagination.page - 1),
    });

    const data = results.map((raw) => ToDomainAdapter.execute(raw));

    return { data, total };
  }

  async findAutocomplete(query: string): Promise<any[]> {
    const limit = 10;

    return await this.repository
      .createQueryBuilder('customer')
      .select(['customer.identifier as name', 'customer.uuid as uuid'])
      .where('customer.identifier ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();
  }

  async findCustomerActivityByUuid(uuid: UUID): Promise<CustomerActivity> {
    const where: any = { uuid };
    const relations = [
      'customer',
      'activity',
    ];

    const customerActivity = await this.customerActivityRepository.findOne({
      where,
      relations,
    });

    if (!customerActivity) return null;

    return new CustomerActivity({
      id: customerActivity.id,
      uuid: customerActivity.uuid,
      customerId: customerActivity.customer.id,
      activity: {
        id: customerActivity.activity.id,
        uuid: customerActivity.activity.uuid,
        name: customerActivity.activity.name,
      },

    });
  }

  async findCustomerCropByUuid(uuid: UUID): Promise<CustomerCrop> {
    const where: any = { uuid };
    const relations = [
      'customer',
      'crop',
      'locations',
      'cultivation',
    ];

    const customerCrop = await this.customerCropRepository.findOne({
      where,
      relations,
    });

    if (!customerCrop) return null;

    return new CustomerCrop({
      id: customerCrop.id,
      uuid: customerCrop.uuid,
      customerId: customerCrop.customer.id,
      identification: customerCrop.identification,
      cropStatus: customerCrop.status,
      description: customerCrop.description,
      plantingDate: customerCrop.plantingDate,
      harvestDate: customerCrop.harvestDate,
      plantedAreaHectares: Number(customerCrop.plantedAreaHectares),
      averageProductivity: Number(customerCrop.averageProductivity),
      conservativeProductivity: Number(customerCrop.conservativeProductivity),
      expectedTotalProduction: Number(customerCrop.expectedTotalProduction),
      nitrogenPercentage: Number(customerCrop.nitrogenPercentage),
      phosphorusPercentage: Number(customerCrop.phosphorusPercentage),
      potassiumPercentage: Number(customerCrop.potassiumPercentage),
      ammoniumSulfatePercentage: Number(customerCrop.ammoniumSulfatePercentage),
      defensivePercentage: Number(customerCrop.defensivePercentage),
      seedPercentage: Number(customerCrop.seedPercentage),
      totalSoldBags: Number(customerCrop.totalSoldBags),
      totalSoldPercentage: Number(customerCrop.totalSoldPercentage),
      averageSalesValue: Number(customerCrop.averageSalesValue),
      cultivation: {
        id: customerCrop.cultivation.id,
        uuid: customerCrop.cultivation.uuid,
        name: customerCrop.cultivation.name,
      },
      crop: {
        id: customerCrop.crop.id,
        uuid: customerCrop.crop.uuid,
        name: customerCrop.crop.name,
        type: customerCrop.crop.type,
      },
      locations: customerCrop.locations?.map((loc) => ({
        id: loc.id,
        uuid: loc.uuid,
        name: loc.name,
      })) || [],

    });
  }

  async findCustomerCropInformationByUuid(uuid: UUID): Promise<CustomerCropInformation> {
    const where: any = { uuid };
    const relations = [
      'customer',
      'cultivations',
      'cultivations.cultivation',
    ];

    const customerCropInformation = await this.customerCropInformationRepository.findOne({
      where,
      relations,
    });

    if (!customerCropInformation) return null;

    return new CustomerCropInformation({
      id: customerCropInformation.id,
      uuid: customerCropInformation.uuid,
      customerId: customerCropInformation.customer.id,
      typeCrop: customerCropInformation.typeCrop,
      plantingSeasonStart: customerCropInformation.plantingSeasonStart,
      plantingSeasonEnd: customerCropInformation.plantingSeasonEnd,
      harvestSeasonStart: customerCropInformation.harvestSeasonStart,
      harvestSeasonEnd: customerCropInformation.harvestSeasonEnd,
      cultivations: customerCropInformation.cultivations?.map((cult) => ({
        id: cult.id,
        uuid: cult.uuid,
        cultivation: {
          id: cult.cultivation?.id,
          uuid: cult.cultivation?.uuid,
          name: cult.cultivation?.name,
          description: cult.cultivation?.description,
        },
      })) || [],
    });
  }

  async findCustomerCropInfoCultivationByUuid(uuid: UUID): Promise<CustomerCropInformationCultivation> {
    const where: any = { uuid };
    const relations = [
      'customerCropInformation',
      'cultivation',
    ];

    const customerCropInfoCultivation = await this.customerCropInfoCultivationEntityRepository.findOne({
      where,
      relations,
    });

    if (!customerCropInfoCultivation) return null;

    return new CustomerCropInformationCultivation({
      id: customerCropInfoCultivation.id,
      uuid: customerCropInfoCultivation.uuid,
      customerCropInformationId: customerCropInfoCultivation.customerCropInformation.id,
      cultivation: {
        id: customerCropInfoCultivation.cultivation?.id,
        uuid: customerCropInfoCultivation.cultivation?.uuid,
        name: customerCropInfoCultivation.cultivation?.name,
        description: customerCropInfoCultivation.cultivation?.description,
      },
    });
  }

  async findCustomerPersonByUuid(uuid: UUID): Promise<CustomerPerson> {
    const where: any = { uuid };
    const relations = [
      'customer',
      'person',
      'occupation',
    ];

    const customerPerson = await this.customerPersonRepository.findOne({
      where,
      relations,
    });

    if (!customerPerson) return null;

    return new CustomerPerson({
      id: customerPerson.id,
      uuid: customerPerson.uuid,
      customerId: customerPerson.customer.id,
      person: {
        id: customerPerson.person.id,
        uuid: customerPerson.person.uuid,
        name: customerPerson.person.name,
      },
      occupation: {
        id: customerPerson.occupation.id,
        uuid: customerPerson.occupation.uuid,
        name: customerPerson.occupation.name,
      },
    });
  }

}
