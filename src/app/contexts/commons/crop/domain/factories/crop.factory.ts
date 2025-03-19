import { Crop, CropProps } from 'commons/crop/domain/crop';
import { CropTypeEnum } from 'enumerates/crop-type.enum';

export class CropFactory {
  static create({ type, start, end }: Omit<CropProps, 'id' | 'uuid' | 'name'>): Crop {
    const startDate = start || new Date().getFullYear();
    const endDate = end ?? this.calculateEndDate(type, startDate);
    const name = this.generateName(startDate, endDate, type);

    return new Crop({
      type,
      start: startDate,
      end: endDate,
      name,
    });
  }

  private static generateName(start: number, end: number, type: CropTypeEnum): string {
    return `${type} ${start}/${end}`;
  }

  private static calculateEndDate(type: CropTypeEnum, start: number): number {
    return type === CropTypeEnum.SUMMER ? start + 1 : start;
  }
}
