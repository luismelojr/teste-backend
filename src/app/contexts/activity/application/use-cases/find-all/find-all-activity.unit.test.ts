import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Provider } from '@nestjs/common';
import { FindAllActivity } from './find-all-activity';
import {
  ActivityRepository,
} from 'activity/infrastructure/activity.repository';
import { Activity } from 'activity/domain/activity';


describe('FindAllActivity', () => {
  let useCase: FindAllActivity;
  let mockActivityRepository;

  beforeEach(async () => {
    mockActivityRepository = {
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
        provide: ActivityRepository,
        useValue: mockActivityRepository,
      },
    ];

    const useCases: Provider[] = [FindAllActivity];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAllActivity>(FindAllActivity);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAll', () => {
    it('should findAll Activity', async () => {
      const mockActivity1 = {
        id: '1',
        uuid: generateUuidV4(),
        name: 'Patria Agronegócios',
      };
      const mockActivity2 = {
        id: '2',
        uuid: generateUuidV4(),
        name: 'Patria Agronegócios',
      };

      mockActivityRepository.findAll.mockResolvedValue({
        data: [
          new Activity({
            ...mockActivity1,
          }),
          new Activity({
            ...mockActivity2,
          }),
        ],
        total: 2,
      });

      const executeCommand = {
        pagination: { page: 1, maxPageSize: 10 },
        searchText: 'teste',
      };

      await useCase.execute(executeCommand);

      expect(mockActivityRepository.findAll).toHaveBeenCalledWith(executeCommand);
    });
  });
});
