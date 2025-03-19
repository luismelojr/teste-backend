import { IsNotEmpty } from 'class-validator';
import { ContractTypeInterface } from '../../@types/ContractTypeInterface';

export class CreateEmployeeInput {
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
