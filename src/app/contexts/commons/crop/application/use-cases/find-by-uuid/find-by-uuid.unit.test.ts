import {
  FindByUuidCrop
} from 'commons/crop/application/use-cases/find-by-uuid/find-by-uuid-crop';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Provider } from '@nestjs/common';
import { CropRepository } from 'commons/crop/infrastructure/crop.repository';
import { Test, TestingModule } from '@nestjs/testing';

describe('FindByUuidCrop', () => {
  let useCase: FindByUuidCrop;
  let mockCropRepository;

  const uuid = generateUuidV4()

  const mockCrop = {
    uuid,
    name: 'Teste Safra',
  }

  beforeEach(async () => {
    mockCropRepository = {
      delete: jest.fn(),
      create: jest.fn(),
      findOneByUuid: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn()
    };

    const infrastructure: Provider[] = [
      {
        provide: CropRepository,
        useValue: mockCropRepository
      }
    ]

    const useCases: Provider[] = [FindByUuidCrop]

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases]
    }).compile()

    useCase = module.get<FindByUuidCrop>(FindByUuidCrop)
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  describe('findByUuid', () => {
    it('should findByUuid Crop', async () => {
      mockCropRepository.findOneByUuid.mockResolvedValue(mockCrop)

      const result = await useCase.execute({ uuid })

      expect(result).toEqual(mockCrop)
    })

    it('should throw error when uuid is not provided', async () => {
      await expect(useCase.execute({ uuid: '' })).rejects.toThrow('uuid is required')
    })

    it('should throw error when crop is not found', async () => {
      const newUuid = generateUuidV4()
      await expect(useCase.execute({ uuid: newUuid })).rejects.toThrow('crop is not found')
    })
  })
})
