import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import {
  EmployeeRepository
} from '../../../infrastructure/employee.repository';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import { UUID } from 'shared/types/uuid';
import { ContractTypeInterface } from '../../../@types/ContractTypeInterface';
import { Employee } from '../../../domain/employee';

interface executeCommand {
  pagination: PaginationInput;
  searchText?: string;
}

@Injectable()
export class FindAllEmployee extends UseCase {
  constructor(
    @Inject(EmployeeRepository)
    protected readonly repository: EmployeeRepository,
  ) {
    super();
  }

  outputAdapter(result): employeeDTO[] {
    return result.data.map((employee: Employee) => {
      return {
        uuid: employee.uuid,
        business_phone: employee.business_phone.getValue(),
        business_email: employee.business_email.getValue(),
        contract_type: employee.contract_type,
        occupation: employee.occupation,
        start_date: employee.start_date,
        shutdown_date: employee.shutdown_date,
      }
    })
  }

  async execute(command: executeCommand): Promise<Output> {
    const { pagination, searchText } = command;

    const result = await this.repository.findAll({ pagination, searchText });

    return {
      data: this.outputAdapter(result),
      total: result.total
    }
  }
}

type employeeDTO = {
  uuid: UUID;
  business_phone: string;
  business_email: string;
  contract_type: ContractTypeInterface;
  occupation: string;
  start_date: Date;
  shutdown_date?: Date;
}

type Output = {
  data: employeeDTO[];
  total: number;
}
