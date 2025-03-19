import { UUID } from 'shared/types/uuid';
import { ApiProperty } from '@nestjs/swagger';

export class FindAutocompleteEventTypeOutput {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: UUID;

  @ApiProperty({ example: 'Reunião' })
  name: string;
}
