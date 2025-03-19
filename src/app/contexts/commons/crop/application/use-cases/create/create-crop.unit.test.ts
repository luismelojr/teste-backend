import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  CreateCrop,
} from 'commons/crop/application/use-cases/create/create-crop';
import { Provider } from '@nestjs/common';
import { CropRepository } from 'commons/crop/infrastructure/crop.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { Crop } from 'commons/crop/domain/crop';
import { CropTypeEnum } from 'enumerates/crop-type.enum';

const uuid = generateUuidV4();

describe('CreateCrop', () => {
  let useCase: CreateCrop;
  let mockCropRepository;

  const mockCrop = {
    type: CropTypeEnum.SUMMER,
    start: 2025,
  };

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

    const useCases: Provider[] = [CreateCrop];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<CreateCrop>(CreateCrop);
  });

  it('should be defined', async () => {
    expect(useCase).toBeDefined();
  });

  describe('create', () => {
    it('should create a crop with type and start', async () => {
      const createCrop = new Crop({
        id: '1',
        uuid,
        type: mockCrop.type,
        start: mockCrop.start,
      });

      mockCropRepository.create.mockResolvedValue({
        ...createCrop,
      });

      const executeCommand = {
        type: mockCrop.type,
        start: mockCrop.start,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockCropRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: mockCrop.type,
          start: mockCrop.start,
        }),
      );

      expect(result).toEqual(
        new Crop({
          id: '1',
          uuid,
          type: mockCrop.type,
          start: mockCrop.start,
        }),
      );
    });

    it('should create a crop with type only', async () => {
      const createCrop = new Crop({
        id: '1',
        uuid,
        type: mockCrop.type,
      });

      mockCropRepository.create.mockResolvedValue({
        ...createCrop,
      });

      const executeCommand = {
        type: mockCrop.type,
      };

      const result = await useCase.execute(executeCommand);

      expect(mockCropRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: mockCrop.type,
        }),
      );

      expect(result).toEqual(
        new Crop({
          id: '1',
          uuid,
          type: mockCrop.type,
        }),
      );
    });
  });


});
