import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'shared/types/uuid';


export class UpdateUserInput {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  uuid: UUID;

  @ApiProperty({ example: 'patria@patria.com.br' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'patria@patria.com.br' })
  @IsString()
  @IsNotEmpty()
  email: string;
}
