import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { NotFoundException, Provider } from '@nestjs/common';
import { UpdateOccupation } from './update-occupation';
import {
  OccupationRepository,
} from '../../../infrastructure/occupation.repository';
import { Occupation } from '../../../domain/occupation';

const uuid = generateUuidV4();

describe('UpdateOccupation', () => {
  let useCase: UpdateOccupation;
  let mockOccupationRepository;

  const mockOccupation = {
    name: 'Agrônomo',
  };

  beforeEach(async () => {
    mockOccupationRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findOneById: jest.fn(),
      findOneByUuid: jest.fn(),
      findAll: jest.fn(),
      findAutocomplete: jest.fn(),
    };


    const infrastructure: Provider[] = [
      {
        provide: OccupationRepository,
        useValue: mockOccupationRepository,
      },
    ];

    const useCases: Provider[] = [UpdateOccupation];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<UpdateOccupation>(UpdateOccupation);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('update', () => {
    it('should update occupation', async () => {
      mockOccupationRepository.findOneByUuid.mockResolvedValue(new Occupation({
        ...mockOccupation,
        id: '1',
        uuid: uuid,
      }));

      mockOccupationRepository.update.mockResolvedValue(new Occupation({
        ...mockOccupation,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        ...mockOccupation,
        uuid: uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockOccupationRepository.update).toHaveBeenCalledWith(new Occupation({
        ...mockOccupation,
        id: '1',
        uuid: uuid,
      }));

      expect(result).toEqual({
        uuid: uuid,
        name: mockOccupation.name,
      });
    });
  });

  it('should update occupation without city', async () => {
    mockOccupationRepository.findOneByUuid.mockResolvedValue(new Occupation({
      ...mockOccupation,
      id: '1',
      uuid: uuid,
    }));

    mockOccupationRepository.update.mockResolvedValue(new Occupation({
      ...mockOccupation,
      id: '1',
      uuid: uuid,
    }));

    const executeCommand = {
      ...mockOccupation,
      uuid: uuid,
    };

    const result = await useCase.execute(executeCommand);

    expect(mockOccupationRepository.update).toHaveBeenCalledWith(new Occupation({
      ...mockOccupation,
      id: '1',
      uuid: uuid,
    }));

    expect(result).toEqual({
      uuid: uuid,
      name: mockOccupation.name,
    });
  });


  it('should throw NotFoundException when not has Occupation with uuid', async () => {
    mockOccupationRepository.findOneByUuid.mockResolvedValue(undefined);

    const executeCommand = {
      ...mockOccupation,
      uuid: uuid,
    };

    await expect(
      useCase.execute(executeCommand),
    ).rejects.toThrow(
      new NotFoundException('occupation is not found'),
    );
  });
});
