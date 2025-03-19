import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { BadRequestException, Provider } from '@nestjs/common';
import { CreateOccupation } from './create-occupation';
import {
  OccupationRepository,
} from '../../../infrastructure/occupation.repository';
import { Occupation } from '../../../domain/occupation';

const uuid = generateUuidV4();

describe('CreateOccupation', () => {
  let useCase: CreateOccupation;
  let mockOccupationRepository;

  const mockOccupation = {
    name: 'Agrônomo',
    description: 'Patria Agronegócios descricao',
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

    const useCases: Provider[] = [CreateOccupation];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<CreateOccupation>(CreateOccupation);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('create', () => {
    it('should create Occupation', async () => {
      mockOccupationRepository.create.mockResolvedValue(new Occupation({
        ...mockOccupation,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: mockOccupation.name,
        description: mockOccupation.description,
      };

      const result = await useCase.execute(executeCommand);

      expect(result).toEqual({
        uuid: uuid,
        name: mockOccupation.name,
        description: mockOccupation.description,
      });
    });


    it('should throw BadRequestException when not has name', async () => {
      mockOccupationRepository.findOneByUuid.mockResolvedValue(new Occupation({
        ...mockOccupation,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: undefined,
        description: mockOccupation.description,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new BadRequestException('name is required'),
      );
    });
  });
});
