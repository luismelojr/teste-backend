import { Test, TestingModule } from '@nestjs/testing';
import { ContractRepository } from 'contract/infrastructure/contract.repository';
import { CustomerRepository } from 'customer/infrastructure/customer.repository';
import { PlanRepository } from 'plan/infrastructure/plan.repository';
import { CompanyRepository } from 'company/infrastructure/company.repository';
import { PersonRepository } from 'person/infrastructure/person.repository';
import { Contract } from 'contract/domain/contract';
import { CreateContract } from 'contract/application/use-cases/create/create-contract';
import { ContractRelationFetch } from 'contract/application/use-cases/contract-relation-fetch';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { DataSource } from 'typeorm';
import { Customer } from 'customer/domain/customer';

describe('CreateContract UseCase', () => {
  let createContract: CreateContract;
  let contractRepository;
  let customerRepository;
  let planRepository;
  let companyRepository;
  let personRepository;
  let dataSource;
  let queryRunner;

  const command = {
    identifier: 'CT-001',
    description: 'Contrato anual',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    plan: {
      uuid: generateUuidV4(),
      name: 'Plano Premium',
    },
    company: {
      uuid: generateUuidV4(),
      name: 'ACME Corporation',
    },
  };

  const planData = {
    id: '1',
    uuid: command.plan.uuid,
    name: 'Plano Premium',
    description: 'Plano com todos os recursos',
  };

  const companyData = {
    id: '2',
    uuid: command.company.uuid,
    name: 'ACME Corporation',
    cnpj: '12.345.678/0001-90',
  };

  const savedContract = new Contract({
    id: '1',
    uuid: generateUuidV4(),
    identifier: 'CT-001',
    description: 'Contrato anual',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    plan: planData,
    company: {
      id: companyData.id,
      uuid: companyData.uuid,
      name: companyData.name,
      cnpj: companyData.cnpj,
    },
  });

  const savedCustomer = new Customer({
    id: '1',
    uuid: generateUuidV4(),
    identifier: 'ACME Corporation',
    groupIdentifier: 'CT-001',
    grainConsumer: {
      isConsumer: false,
      isOwnGrain: false,
      isReceiveThirdGrains: false,
      annualQuantity: 0,
    },
  });

  const contractWithCustomer = new Contract({
    id: '1',
    uuid: savedContract.uuid,
    identifier: 'CT-001',
    description: 'Contrato anual',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    plan: planData,
    company: {
      id: companyData.id,
      uuid: companyData.uuid,
      name: companyData.name,
      cnpj: companyData.cnpj,
    },
    customerId: savedCustomer.id,
  });

  beforeEach(async () => {
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    };

    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateContract,
        ContractRelationFetch,
        { provide: ContractRepository, useValue: {
            create: jest.fn(),
            update: jest.fn(),
          } },
        { provide: CustomerRepository, useValue: { create: jest.fn() } },
        { provide: PlanRepository, useValue: { findOneByUuid: jest.fn() } },
        { provide: CompanyRepository, useValue: { findOneByUuid: jest.fn() } },
        { provide: PersonRepository, useValue: { findOneByUuid: jest.fn() } },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    createContract = module.get<CreateContract>(CreateContract);
    contractRepository = module.get<ContractRepository>(ContractRepository);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);
    planRepository = module.get<PlanRepository>(PlanRepository);
    companyRepository = module.get<CompanyRepository>(CompanyRepository);
    personRepository = module.get<PersonRepository>(PersonRepository);
  });

  it('should successfully create a contract with company', async () => {
    // Mock das dependências
    planRepository.findOneByUuid.mockResolvedValue(planData);
    companyRepository.findOneByUuid.mockResolvedValue(companyData);
    contractRepository.create.mockResolvedValue(savedContract);
    customerRepository.create.mockResolvedValue(savedCustomer);
    contractRepository.update.mockResolvedValue(contractWithCustomer);

    // Executar o caso de uso
    const result = await createContract.execute(command);

    // Verificar resultados
    expect(queryRunner.startTransaction).toHaveBeenCalled();
    expect(planRepository.findOneByUuid).toHaveBeenCalledWith(command.plan.uuid);
    expect(companyRepository.findOneByUuid).toHaveBeenCalledWith(command.company.uuid);
    expect(contractRepository.create).toHaveBeenCalledWith(expect.any(Contract));
    expect(customerRepository.create).toHaveBeenCalledWith(expect.any(Customer));
    expect(contractRepository.update).toHaveBeenCalledWith(expect.any(Contract));
    expect(queryRunner.commitTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();

    // Verificar output
    expect(result.uuid).toBe(savedContract.uuid);
    expect(result.identifier).toBe(savedContract.identifier);
    expect(result.plan.id).toBe(planData.id);
    expect(result.company.id).toBe(companyData.id);
    expect(result.customerId).toBe(savedCustomer.id);
  });

  it('should successfully create a contract with person', async () => {
    const personCommand = {
      identifier: 'CT-002',
      description: 'Contrato pessoal',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      plan: {
        uuid: generateUuidV4(),
        name: 'Plano Básico',
      },
      person: {
        uuid: generateUuidV4(),
        name: 'João Silva',
      },
    };

    const personData = {
      id: '3',
      uuid: personCommand.person.uuid,
      name: 'João Silva',
      cpf: '123.456.789-00',
    };

    const contractWithPerson = new Contract({
      id: '2',
      uuid: generateUuidV4(),
      identifier: 'CT-002',
      description: 'Contrato pessoal',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      plan: planData,
      person: {
        id: personData.id,
        uuid: personData.uuid,
        name: personData.name,
        cpf: personData.cpf,
      },
    });

    const customerFromPerson = new Customer({
      id: '2',
      uuid: generateUuidV4(),
      identifier: 'João Silva',
      groupIdentifier: 'CT-002',
      grainConsumer: {
        isConsumer: false,
        isOwnGrain: false,
        isReceiveThirdGrains: false,
        annualQuantity: 0,
      },
    });

    const contractWithCustomerPerson = new Contract({
      id: '2',
      uuid: contractWithPerson.uuid,
      identifier: 'CT-002',
      description: 'Contrato pessoal',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      plan: planData,
      person: {
        id: personData.id,
        uuid: personData.uuid,
        name: personData.name,
        cpf: personData.cpf,
      },
      customerId: customerFromPerson.id,
    });

    // Mock das dependências
    planRepository.findOneByUuid.mockResolvedValue(planData);
    personRepository.findOneByUuid.mockResolvedValue(personData);
    contractRepository.create.mockResolvedValue(contractWithPerson);
    customerRepository.create.mockResolvedValue(customerFromPerson);
    contractRepository.update.mockResolvedValue(contractWithCustomerPerson);

    // Executar o caso de uso
    const result = await createContract.execute(personCommand);

    // Verificar resultados
    expect(planRepository.findOneByUuid).toHaveBeenCalledWith(personCommand.plan.uuid);
    expect(personRepository.findOneByUuid).toHaveBeenCalledWith(personCommand.person.uuid);
    expect(contractRepository.create).toHaveBeenCalledWith(expect.any(Contract));
    expect(customerRepository.create).toHaveBeenCalledWith(expect.any(Customer));
    expect(contractRepository.update).toHaveBeenCalledWith(expect.any(Contract));

    // Verificar output
    expect(result.uuid).toBe(contractWithPerson.uuid);
    expect(result.identifier).toBe(contractWithPerson.identifier);
    expect(result.plan.id).toBe(planData.id);
    expect(result.person.id).toBe(personData.id);
    expect(result.customerId).toBe(customerFromPerson.id);
  });

  it('should throw an error if plan is not found', async () => {
    planRepository.findOneByUuid.mockResolvedValue(null);

    await expect(createContract.execute(command)).rejects.toThrow('Plan not found');
    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });

  it('should throw an error if company is not found', async () => {
    planRepository.findOneByUuid.mockResolvedValue(planData);
    companyRepository.findOneByUuid.mockResolvedValue(null);

    await expect(createContract.execute(command)).rejects.toThrow('Company not found');
    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });

  it('should throw an error if neither company nor person is provided', async () => {
    const invalidCommand = {
      identifier: 'CT-003',
      description: 'Contrato inválido',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      plan: {
        uuid: generateUuidV4(),
        name: 'Plano Básico',
      },
    };

    planRepository.findOneByUuid.mockResolvedValue(planData);

    await expect(createContract.execute(invalidCommand as any)).rejects.toThrow('At least one of company or person must be provided');
    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });
});
