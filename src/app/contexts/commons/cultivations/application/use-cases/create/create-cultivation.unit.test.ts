import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { BadRequestException, Provider } from '@nestjs/common';
import {
  CreateCultivation
} from 'commons/cultivations/application/use-cases/create/create-cultivation';
import {
  CultivationRepository
} from 'commons/cultivations/infrastructure/cultivation.repository';
import { Cultivation } from 'commons/cultivations/domain/cultivation';

const uuid = generateUuidV4();

describe('CreateCultivation', () => {
  let useCase: CreateCultivation;
  let mockCultivationRepository;

  const mockCultivation = {
    name: 'Patria Agronegócios',
    description: 'Patria Agronegócios descricao',
  };

  beforeEach(async () => {
    mockCultivationRepository = {
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
        provide: CultivationRepository,
        useValue: mockCultivationRepository,
      },
    ];

    const useCases: Provider[] = [CreateCultivation];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<CreateCultivation>(CreateCultivation);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('create', () => {
    it('should create cultivation', async () => {
      mockCultivationRepository.create.mockResolvedValue(new Cultivation({
        ...mockCultivation,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: mockCultivation.name,
        description: mockCultivation.description,
      };

      const result = await useCase.execute(executeCommand);

      expect(result).toEqual({
        uuid: uuid,
        name: mockCultivation.name,
        description: mockCultivation.description,
      });
    });


    it('should throw BadRequestException when not has name', async () => {
      mockCultivationRepository.findOneByUuid.mockResolvedValue(new Cultivation({
        ...mockCultivation,
        id: '1',
        uuid: uuid,
      }));

      const executeCommand = {
        name: undefined,
        description: mockCultivation.description,
      };

      await expect(
        useCase.execute(executeCommand),
      ).rejects.toThrow(
        new BadRequestException('Name is required'),
      );
    });
  });
});
