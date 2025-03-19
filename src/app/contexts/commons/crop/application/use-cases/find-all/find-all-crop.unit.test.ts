import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Provider } from '@nestjs/common';
import {
  FindAllCrop,
} from 'commons/crop/application/use-cases/find-all/find-all-crop';
import { CropRepository } from 'commons/crop/infrastructure/crop.repository';
import { Crop } from 'commons/crop/domain/crop';
import { CropTypeEnum } from 'enumerates/crop-type.enum';

describe('FindAllCrop', () => {
  let useCase: FindAllCrop;
  let mockCropRepository;

  beforeEach(async () => {
    mockCropRepository = {
      delete: jest.fn(),
      create: jest.fn(),
      findOneByUuid: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };

    const infrastructure: Provider[] = [
      {
        provide: CropRepository,
        useValue: mockCropRepository,
      },
    ];

    const useCases: Provider[] = [FindAllCrop];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAllCrop>(FindAllCrop);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAll', () => {
    it('should findAll Crop', async () => {
      const mockCrop = {
        id: '1',
        uuid: generateUuidV4(),
        type: CropTypeEnum.SUMMER,
      };
      const mockCrop2 = {
        id: '1',
        uuid: generateUuidV4(),
        type: CropTypeEnum.SUMMER,
      };

      mockCropRepository.findAll.mockResolvedValue({
        data: [
          new Crop({
            ...mockCrop,
          }),
          new Crop({
            ...mockCrop2,
          }),
        ],
        total: 2,
      });

      const executeCommand = {
        pagination: { page: 1, maxPageSize: 10 },
        searchText: 'teste',
      };

      await useCase.execute(executeCommand);

      expect(mockCropRepository.findAll).toHaveBeenCalledWith(executeCommand);
    });
  });
});
