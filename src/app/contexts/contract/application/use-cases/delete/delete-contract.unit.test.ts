import { Test, TestingModule } from '@nestjs/testing';
import { ContractRepository } from 'contract/infrastructure/contract.repository';
import { DeleteContract } from 'contract/application/use-cases/delete/delete-contract';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { DataSource } from 'typeorm';

describe('DeleteContract UseCase', () => {
  let deleteContract: DeleteContract;
  let contractRepository;
  let dataSource;
  let queryRunner;

  const contractUuid = generateUuidV4();

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
        DeleteContract,
        {
          provide: ContractRepository,
          useValue: {
            delete: jest.fn(),
            findOneByUuid: jest.fn(),
          },
        },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    deleteContract = module.get<DeleteContract>(DeleteContract);
    contractRepository = module.get<ContractRepository>(ContractRepository);
  });

  it('should successfully delete a contract', async () => {
    contractRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: contractUuid,
      identifier: 'CT-001',
    });
    contractRepository.delete.mockResolvedValue(undefined);

    await deleteContract.execute(contractUuid);

    expect(queryRunner.startTransaction).toHaveBeenCalled();
    expect(contractRepository.findOneByUuid).toHaveBeenCalledWith(contractUuid);
    expect(contractRepository.delete).toHaveBeenCalledWith(contractUuid);
    expect(queryRunner.commitTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });

  it('should throw an error if contract is not found', async () => {
    contractRepository.findOneByUuid.mockResolvedValue(null);

    await expect(deleteContract.execute(contractUuid)).rejects.toThrow(
      'Contract not found',
    );

    expect(queryRunner.startTransaction).toHaveBeenCalled();
    expect(contractRepository.findOneByUuid).toHaveBeenCalledWith(contractUuid);
    expect(contractRepository.delete).not.toHaveBeenCalled();
    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });

  it('should rollback transaction if an error occurs during deletion', async () => {
    contractRepository.findOneByUuid.mockResolvedValue({
      id: '1',
      uuid: contractUuid,
      identifier: 'CT-001',
    });
    contractRepository.delete.mockRejectedValue(new Error('Database error'));

    await expect(deleteContract.execute(contractUuid)).rejects.toThrow(
      'Database error',
    );

    expect(queryRunner.startTransaction).toHaveBeenCalled();
    expect(contractRepository.findOneByUuid).toHaveBeenCalledWith(contractUuid);
    expect(contractRepository.delete).toHaveBeenCalledWith(contractUuid);
    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });
});
