import { IsNotEmpty } from 'class-validator';
import { UUID } from 'shared/types/uuid';

export class UpdateCultivationInput {
  @IsNotEmpty()
  uuid: UUID;
  @IsNotEmpty()
  name: string;
  description?: string;
}
