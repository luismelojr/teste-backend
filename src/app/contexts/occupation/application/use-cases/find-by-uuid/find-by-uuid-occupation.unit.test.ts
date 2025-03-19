import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { FindByUuidOccupation } from './find-by-uuid-occupation';
import {
  OccupationRepository,
} from '../../../infrastructure/occupation.repository';
import { Occupation } from '../../../domain/occupation';

describe('FindByUuidOccupation', () => {
  let useCase: FindByUuidOccupation;
  let mockOccupationRepository;

  const uuid = generateUuidV4();
  const mockOccupation = {
    uuid,
    name: 'Agrônomo',
    description: 'Patria Agronegócio',
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

    const useCases: Provider[] = [FindByUuidOccupation];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindByUuidOccupation>(FindByUuidOccupation);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findByUuid', () => {
    it('should findByUuid Occupation', async () => {
      mockOccupationRepository.findOneByUuid.mockResolvedValue(new Occupation({
        ...mockOccupation,
        id: '1',
      }));

      const executeCommand = {
        uuid,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockOccupationRepository.findOneByUuid).toHaveBeenCalledWith(uuid);
      expect(result).toEqual({
        uuid: uuid,
        name: mockOccupation.name,
        description: mockOccupation.description,
      });
    });

    it('should throw BadRequestException when not has uuid', async () => {
      mockOccupationRepository.findOneByUuid.mockResolvedValue(new Occupation({
        ...mockOccupation,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        uuid: undefined,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new BadRequestException('uuid is required'),
      );
    });

    it('should throw NotFoundException when not has Occupation with uuid', async () => {
      mockOccupationRepository.findOneByUuid.mockResolvedValue(undefined);

      const executeCommand = {
        uuid: uuid,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new NotFoundException('Occupation is not found'),
      );
    });
  });
});
