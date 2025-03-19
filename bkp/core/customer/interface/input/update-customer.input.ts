import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { UUID } from 'shared/types/uuid';

export class UpdateCustomerInput {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  uuid: UUID;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  group_identifier?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @ValidateIf((o) => o.group_identifier !== undefined)
  financial_tools?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @ValidateIf((o) => o.group_identifier !== undefined)
  grain_consumer?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @ValidateIf((o) => o.grain_consumer === true)
  own_grain?: boolean;

  @ApiProperty({ required: false })
  @IsNumber()
  @ValidateIf((o) => o.grain_consumer === true)
  annual_quantity?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @ValidateIf((o) => o.grain_consumer === true)
  receive_third_grains?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @ValidateIf((o) => o.group_identifier !== undefined)
  receives_land_rent?: boolean;
}
