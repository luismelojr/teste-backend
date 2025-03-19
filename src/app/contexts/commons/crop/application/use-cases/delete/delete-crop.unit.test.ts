import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import {
  DeleteCrop
} from 'commons/crop/application/use-cases/delete/delete-crop';
import { Provider } from '@nestjs/common';
import { CropRepository } from 'commons/crop/infrastructure/crop.repository';
import { Test, TestingModule } from '@nestjs/testing';

const uuid = generateUuidV4()

const mockCrop = {
  uuid: uuid,
  name: 'Teste Safra',
  description: 'Teste Safra Descricao',
}

describe('DeleteCrop', () => {
  let useCase: DeleteCrop
  let mockCropRepository

  beforeEach( async () => {
    mockCropRepository = {
      delete: jest.fn(),
      save: jest.fn(),
      findOneByUuid: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn()
    }

    const infrastructure: Provider[] = [
      {
        provide: CropRepository,
        useValue: mockCropRepository
      }
    ]

    const useCases: Provider[] = [DeleteCrop]

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases]
    }).compile()

    useCase = module.get<DeleteCrop>(DeleteCrop)
  })

  it('should be defined', async () => {
    expect(useCase).toBeDefined()
  })

  describe('delete', () => {
    it('should delete a crop', async () => {
      mockCropRepository.findOneByUuid.mockResolvedValueOnce({
        ...mockCrop,
        id: '1'
      })

      const executeCommand = {
        uuid
      }

      await useCase.execute(executeCommand)

      expect(mockCropRepository.delete).toHaveBeenCalledWith(uuid)
    })

    it('should throw BadRequestException when not has uuid', async () => {
      await expect(useCase.execute({uuid: ''})).rejects.toThrow('UUID is required')
    })

    it('should throw NotFoundException when crop not found', async () => {
      const newUUid = generateUuidV4()
      await expect(useCase.execute({uuid: newUUid})).rejects.toThrow('Crop not found')
    })
  })
})
