import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'shared/types/uuid';

export class FindAutocompleteCustomerOutput {
  @ApiProperty()
  uuid: UUID;

  @ApiProperty()
  identifier: string;
}
