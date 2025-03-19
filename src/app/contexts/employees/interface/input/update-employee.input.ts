import { IsNotEmpty } from 'class-validator';
import { ContractTypeInterface } from '../../@types/ContractTypeInterface';
import { UUID } from 'shared/types/uuid';

export class UpdateEmployeeInput {
  @IsNotEmpty()
  uuid: UUID;

  @IsNotEmpty()
  business_phone: string;

  @IsNotEmpty()
  business_email: string;

  @IsNotEmpty()
  contract_type: ContractTypeInterface;

  @IsNotEmpty()
  occupation: string;

  @IsNotEmpty()
  start_date: Date;

  shutdown_date?: Date;
}
