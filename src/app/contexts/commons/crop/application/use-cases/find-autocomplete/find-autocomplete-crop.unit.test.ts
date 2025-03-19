import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { FindAutocompleteCrop } from './find-autocomplete-crop';
import { CropRepository } from 'commons/crop/infrastructure/crop.repository';

describe('FindAutocompleteCrop', () => {
  let useCase: FindAutocompleteCrop;
  let mockCropRepository: jest.Mocked<CropRepository>;

  beforeEach(async () => {
    mockCropRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findOneById: jest.fn(),
      findOneByUuid: jest.fn(),
      findAll: jest.fn(),
      findAutocomplete: jest.fn(),
    } as jest.Mocked<CropRepository>;

    const infrastructure: Provider[] = [
      {
        provide: CropRepository,
        useValue: mockCropRepository,
      },
    ];

    const useCases: Provider[] = [FindAutocompleteCrop];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<FindAutocompleteCrop>(FindAutocompleteCrop);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('findAutocomplete', () => {
    it('should findAutocomplete Crop', async () => {
      const query = 'Safra';

      mockCropRepository.findAutocomplete.mockResolvedValue([
        { name: 'Safra Verão 2025/2026', uuid: '123e4567-e89b-12d3-a456-426614174000' },
        { name: 'Safra Inverno 2024/2025', uuid: '123e4567-e89b-12d3-a456-426614174001' },
      ]);

      await useCase.execute({ query });

      expect(mockCropRepository.findAutocomplete).toHaveBeenCalledWith(query);
    });
  });
});
