import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'shared/types/uuid';
import { Type } from 'class-transformer';

class PersonDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsString()
  uuid?: UUID;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: '99999999999' })
  @IsString()
  cpf: string;
}


export class CreateUserInput {
  @ApiProperty({ example: 'patria@patria.com.br' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'patria@patria.com.br' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: PersonDto })
  @ValidateNested()
  @IsOptional()
  @Type(() => PersonDto)
  person?: PersonDto;
}
