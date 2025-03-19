import { CropTypeEnum } from 'enumerates/crop-type.enum';
import { CropFactory } from 'commons/crop/domain/factories/crop.factory';

describe('CropFactory', () => {
  it('should create a Crop with correct default values when only type is provided', () => {
    const currentYear = new Date().getFullYear();

    const crop = CropFactory.create({ type: CropTypeEnum.SUMMER });

    expect(crop.start).toBe(currentYear);
    expect(crop.end).toBe(currentYear + 1); // Regra do SUMMER
    expect(crop.name).toBe(`SUMMER ${currentYear}/${currentYear + 1}`);
    expect(crop.type).toBe(CropTypeEnum.SUMMER);
  });

  it('should create a Crop with a given start and calculate end correctly for SUMMER', () => {
    const crop = CropFactory.create({ type: CropTypeEnum.SUMMER, start: 2025 });

    expect(crop.start).toBe(2025);
    expect(crop.end).toBe(2026);
    expect(crop.name).toBe('SUMMER 2025/2026');
  });

  it('should create a Crop with a given start and calculate end correctly for SECOND', () => {
    const crop = CropFactory.create({ type: CropTypeEnum.SECOND, start: 2026 });

    expect(crop.start).toBe(2026);
    expect(crop.end).toBe(2026); // Regra do SECOND: start = end
    expect(crop.name).toBe('SECOND 2026/2026');
  });

  it('should create a Crop with given start and end if provided', () => {
    const crop = CropFactory.create({ type: CropTypeEnum.SUMMER, start: 2024, end: 2025 });

    expect(crop.start).toBe(2024);
    expect(crop.end).toBe(2025);
    expect(crop.name).toBe('SUMMER 2024/2025');
  });
});
