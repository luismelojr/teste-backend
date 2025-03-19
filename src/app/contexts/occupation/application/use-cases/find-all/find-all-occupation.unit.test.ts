import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Provider } from '@nestjs/common';
import { FindAllOccupation } from './find-all-occupation';
import {
  OccupationRepository,
} from '../../../infrastructure/occupation.repository';
import { Occupation } from '../../../domain/occupation';


describe('FindAllOccupation', () => {
  let useCase: FindAllOccupation;
  let mockOccupationRepository;

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

    const useCases: Provider[] = [FindAllOccupation];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAllOccupation>(FindAllOccupation);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAll', () => {
    it('should findAll Occupation', async () => {
      const mockOccupation1 = {
        id: '1',
        uuid: generateUuidV4(),
        name: 'Agrônomo',
      };
      const mockOccupation2 = {
        id: '2',
        uuid: generateUuidV4(),
        name: 'Agrônomo',
      };

      mockOccupationRepository.findAll.mockResolvedValue({
        data: [
          new Occupation({
            ...mockOccupation1,
          }),
          new Occupation({
            ...mockOccupation2,
          }),
        ],
        total: 2,
      });

      const executeCommand = {
        pagination: { page: 1, maxPageSize: 10 },
        searchText: 'teste',
      };

      await useCase.execute(executeCommand);

      expect(mockOccupationRepository.findAll).toHaveBeenCalledWith(executeCommand);
    });
  });
});
