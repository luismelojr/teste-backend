import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'shared/types/uuid';

export class UpdateContractInput {
  @IsUUID()
  @IsNotEmpty()
  uuid: UUID;

  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsUUID()
  @IsNotEmpty()
  plan_id: UUID;

  @IsUUID()
  @IsNotEmpty()
  contract_owner_id: UUID;

  @IsOptional()
  @IsUUID()
  company_id?: UUID;

  @IsNotEmpty()
  start_date: Date;

  @IsNotEmpty()
  end_date: Date;

  @IsOptional()
  @IsString()
  description?: string;
}
