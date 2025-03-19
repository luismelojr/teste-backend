import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateIf,
} from 'class-validator';

export class CreateCustomerInput {
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
  @ValidateIf((o) => o.group_identifier !== undefined) // Só valida se `group_identifier` for informado
  financial_tools?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @ValidateIf((o) => o.group_identifier !== undefined)
  grain_consumer?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @ValidateIf((o) => o.grain_consumer === true) // Só valida se `grain_consumer` for true
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
