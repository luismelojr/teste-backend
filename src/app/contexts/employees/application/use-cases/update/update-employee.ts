import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { UUID } from 'shared/types/uuid';
import { ContractTypeInterface } from '../../../@types/ContractTypeInterface';
import {
  EmployeeRepository
} from '../../../infrastructure/employee.repository';
import { Employee } from '../../../domain/employee';

interface executeCommand {
  uuid: UUID;
  business_phone: string;
  business_email: string;
  occupation: string;
  start_date: Date;
  contract_type: ContractTypeInterface;
  shutdown_date?: Date;
}

@Injectable()
export class UpdateEmployee extends UseCase {
  constructor(
    @Inject(EmployeeRepository)
    protected repository: EmployeeRepository,
  ) {
    super();
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { uuid, business_phone, business_email, contract_type, shutdown_date, occupation, start_date } = command;

    const employeeDB = await this.repository.findOneByUuid(uuid);

    if (!employeeDB) throw new NotFoundException('employee is not found');

    const employee = new Employee({
      id: employeeDB.id,
      uuid: employeeDB.uuid,
      business_phone,
      business_email,
      contract_type,
      shutdown_date,
      occupation,
      start_date,
    });

    const saved = await this.repository.update(employee);

    return {
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
  uuid: string;
  business_phone: string;
  business_email: string;
  occupation: string;
  start_date: Date;
  contract_type: ContractTypeInterface;
  shutdown_date?: Date;
}

