import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  BadRequestException,
  NotFoundException,
  Provider,
} from '@nestjs/common';
import { DeleteOccupation } from './delete-occupation';
import {
  OccupationRepository,
} from '../../../infrastructure/occupation.repository';
import { Occupation } from '../../../domain/occupation';

const uuid = generateUuidV4();

describe('DeleteOccupation', () => {
  let useCase: DeleteOccupation;
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

    const useCases: Provider[] = [DeleteOccupation];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<DeleteOccupation>(DeleteOccupation);

  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('delete', () => {
    it('should delete Occupation', async () => {
      mockOccupationRepository.findOneByUuid.mockResolvedValue(new Occupation({
        ...mockOccupation,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        uuid: uuid,
      };

      await useCase.execute(executeCommand);

      expect(mockOccupationRepository.delete).toHaveBeenCalledWith(uuid);
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
        new NotFoundException('Occupation not found'),
      );
    });

  });
});
