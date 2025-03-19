import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Provider } from '@nestjs/common';
import {
  FindAllCultivation
} from 'commons/cultivations/application/use-cases/find-all/find-all-cultivation';
import {
  CultivationRepository
} from 'commons/cultivations/infrastructure/cultivation.repository';
import { Cultivation } from 'commons/cultivations/domain/cultivation';


describe('FindAllCultivation', () => {
  let useCase: FindAllCultivation;
  let mockCultivationRepository;

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

    const useCases: Provider[] = [FindAllCultivation];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAllCultivation>(FindAllCultivation);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAll', () => {
    it('should findAll Cultivation', async () => {
      const mockCultivation1 = {
        id: '1',
        uuid: generateUuidV4(),
        name: 'Patria Agronegócios',
      };
      const mockCultivation2 = {
        id: '2',
        uuid: generateUuidV4(),
        name: 'Patria Agronegócios',
      };

      mockCultivationRepository.findAll.mockResolvedValue({
        data: [
          new Cultivation({
            ...mockCultivation1,
          }),
          new Cultivation({
            ...mockCultivation2,
          }),
        ],
        total: 2,
      });

      const executeCommand = {
        pagination: { page: 1, maxPageSize: 10 },
        searchText: 'teste',
      };

      await useCase.execute(executeCommand);

      expect(mockCultivationRepository.findAll).toHaveBeenCalledWith(executeCommand);
    });
  });
});
