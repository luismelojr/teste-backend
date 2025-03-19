import { Test, TestingModule } from '@nestjs/testing';
import { ContractRepository } from 'contract/infrastructure/contract.repository';
import { FindByUuidContract } from './find-by-uuid-contract';
import { Contract } from 'contract/domain/contract';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { FindByUuidContractOutputAdapter } from './find-by-uuid-contract-output.adapter';

describe('FindByUuidContract UseCase', () => {
  let findByUuidContract: FindByUuidContract;
  let contractRepository;

  const planData = {
    id: '1',
    uuid: generateUuidV4(),
    name: 'Plano Premium',
    description: 'Plano com todos os recursos',
  };

  const companyData = {
    id: '2',
    uuid: generateUuidV4(),
    name: 'ACME Corporation',
    cnpj: '12.345.678/0001-90',
  };

  const mockContract = new Contract({
    id: '1',
    uuid: generateUuidV4(),
    identifier: 'CT-001',
    description: 'Contrato 1',
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

  const mockOutput = {
    uuid: mockContract.uuid,
    identifier: mockContract.identifier,
    description: mockContract.description,
    startDate: mockContract.startDate,
    endDate: mockContract.endDate,
    isActive: mockContract.isActive,
    plan: {
      id: mockContract.plan.id,
      uuid: mockContract.plan.uuid,
      name: mockContract.plan.name,
    },
    company: {
      id: companyData.id,
      uuid: mockContract.company.uuid,
      name: mockContract.company.name,
      cnpj: mockContract.company.cnpj,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByUuidContract,
        {
          provide: ContractRepository,
          useValue: {
            findOneByUuid: jest.fn(),
          },
        },
      ],
    }).compile();

    findByUuidContract = module.get<FindByUuidContract>(FindByUuidContract);
    contractRepository = module.get<ContractRepository>(ContractRepository);

    jest
      .spyOn(FindByUuidContractOutputAdapter, 'execute')
      .mockReturnValue(mockOutput);
  });

  it('should find a contract by uuid', async () => {
    contractRepository.findOneByUuid.mockResolvedValue(mockContract);

    const result = await findByUuidContract.execute({
      uuid: mockContract.uuid,
    });

    expect(contractRepository.findOneByUuid).toHaveBeenCalledWith(
      mockContract.uuid,
    );
    expect(FindByUuidContractOutputAdapter.execute).toHaveBeenCalledWith(
      mockContract,
    );
    expect(result).toEqual(mockOutput);
  });

  it('should throw BadRequestException when uuid is not provided', async () => {
    await expect(findByUuidContract.execute({ uuid: null })).rejects.toThrow(
      BadRequestException,
    );
    await expect(
      findByUuidContract.execute({ uuid: undefined }),
    ).rejects.toThrow(BadRequestException);

    expect(contractRepository.findOneByUuid).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when contract is not found', async () => {
    contractRepository.findOneByUuid.mockResolvedValue(null);

    await expect(
      findByUuidContract.execute({ uuid: 'non-existent-uuid' }),
    ).rejects.toThrow(NotFoundException);

    expect(contractRepository.findOneByUuid).toHaveBeenCalledWith(
      'non-existent-uuid',
    );
  });
});
