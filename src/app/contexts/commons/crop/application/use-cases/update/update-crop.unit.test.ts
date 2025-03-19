import { Test, TestingModule } from '@nestjs/testing';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';
import { Provider } from '@nestjs/common';
import {
  UpdateCrop,
} from 'commons/crop/application/use-cases/update/update-crop';
import { CropRepository } from 'commons/crop/infrastructure/crop.repository';
import { Crop } from 'commons/crop/domain/crop';
import { UUID } from 'shared/types/uuid';
import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { CropFactory } from 'commons/crop/domain/factories/crop.factory';

const uuid: UUID = generateUuidV4();

describe('UpdateCrop', () => {
  let useCase: UpdateCrop;
  let mockCropRepository: jest.Mocked<CropRepository>;

  const mockCrop = new Crop({
    id: '1',
    uuid,
    type: CropTypeEnum.SUMMER,
    start: 2025,
  });

  beforeEach(async () => {
    mockCropRepository = {
      delete: jest.fn(),
      create: jest.fn(),
      findOneByUuid: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      findAutocomplete: jest.fn(),
    } as jest.Mocked<CropRepository>;

    const infrastructure: Provider[] = [
      {
        provide: CropRepository,
        useValue: mockCropRepository,
      },
    ];

    const useCases: Provider[] = [UpdateCrop];

    const module: TestingModule = await Test.createTestingModule({
      providers: [...infrastructure, ...useCases],
    }).compile();

    useCase = module.get<UpdateCrop>(UpdateCrop);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('update', () => {
    it('should update Crop and return updated instance', async () => {
      mockCropRepository.findOneByUuid.mockResolvedValue(mockCrop);

      const executeCommand = {
        uuid: mockCrop.uuid,
        start: 2026,
        type: CropTypeEnum.SECOND,
      };

      // Criando a nova instância usando a fábrica
      const updatedCrop = CropFactory.create({
        type: executeCommand.type,
        start: executeCommand.start,
        end: undefined, // Deixe a fábrica calcular `end` corretamente
      });

      // Mockando o repositório para retornar a nova instância
      mockCropRepository.update.mockResolvedValue(updatedCrop);

      const result = await useCase.execute(executeCommand);

      // Garantir que o repositório `findOneByUuid` foi chamado com o UUID correto
      expect(mockCropRepository.findOneByUuid).toHaveBeenCalledWith(mockCrop.uuid);

      // Garantir que `update` foi chamado corretamente com a nova instância de `Crop`
      expect(mockCropRepository.update).toHaveBeenCalledWith(expect.any(Crop));

      // Verificar se os valores atualizados foram aplicados corretamente
      expect(result.start).toBe(2026);
      expect(result.end).toBe(2026); // Regra do domínio: `SECOND` mantém `start` como `end`
      expect(result.type).toBe(CropTypeEnum.SECOND);
      expect(result.name).toBe('SECOND 2026/2026');
    });

    it('should throw NotFoundException if Crop does not exist', async () => {
      mockCropRepository.findOneByUuid.mockResolvedValue(null);

      const executeCommand = {
        uuid: generateUuidV4(),
        start: 2026,
        type: CropTypeEnum.SECOND,
      };

      await expect(useCase.execute(executeCommand)).rejects.toThrow(
        'Crop not found',
      );

      expect(mockCropRepository.findOneByUuid).toHaveBeenCalledWith(executeCommand.uuid);
      expect(mockCropRepository.update).not.toHaveBeenCalled();
    });
  });
});
