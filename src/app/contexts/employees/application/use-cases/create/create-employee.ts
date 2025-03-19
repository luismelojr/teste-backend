import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import {
  EmployeeRepository
} from '../../../infrastructure/employee.repository';
import { ContractTypeInterface } from '../../../@types/ContractTypeInterface';
import { Employee } from '../../../domain/employee';

interface executeCommand {
  business_phone: string;
  business_email: string;
  occupation: string;
  start_date: Date;
  contract_type: ContractTypeInterface;
  shutdown_date?: Date;
}

@Injectable()
export class CreateEmployee extends UseCase {
  constructor(
    @Inject(EmployeeRepository)
    protected repository: EmployeeRepository
  ) {
    super();
  }

  async execute (command: executeCommand): Promise<Output> {
    const { business_phone, business_email, contract_type, shutdown_date, occupation, start_date } = command;

    if (!business_phone) {
      throw new BadRequestException('business_phone is required');
    }

    if (!business_email) {
      throw new BadRequestException('business_email is required');
    }

    if (!occupation) {
      throw new BadRequestException('occupation is required');
    }

    if (!start_date) {
      throw new BadRequestException('start_date is required');
    }

    if (!contract_type) {
      throw new BadRequestException('contract_type is required');
    }

    const employee = Employee.create({
      business_phone,
      business_email,
      contract_type,
      shutdown_date,
      occupation,
      start_date,
    })

    const saved = await this.repository.create(employee);

    return {
      id: saved.id,
      uuid: saved.uuid,
      business_phone: saved.business_phone.getValue(),
      business_email: saved.business_email.getValue(),
      occupation: saved.occupation,
      start_date: saved.start_date,
      contract_type: saved.contract_type,
      shutdown_date: saved.shutdown_date,
    }
  }
}

type Output = {
  id: number;
  uuid: string;
  business_phone: string;
  business_email: string;
  occupation: string;
  start_date: Date;
  contract_type: ContractTypeInterface;
  shutdown_date?: Date;
}
