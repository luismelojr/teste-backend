import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import {
  EmployeeRepository
} from '../../../infrastructure/employee.repository';
import { UUID } from 'shared/types/uuid';
import { ContractTypeInterface } from '../../../@types/ContractTypeInterface';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class FindOneByUuidEmployee extends UseCase {
  constructor(
    @Inject(EmployeeRepository)
    protected readonly repository: EmployeeRepository,
  ) {
    super();
  }

  async execute(command: executeCommand): Promise<employeeDTO> {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const employee = await this.repository.findOneByUuid(uuid);

    if (!employee) throw new NotFoundException('employee not found');

    return {
      uuid: employee.uuid,
      business_phone: employee.business_phone.getValue(),
      business_email: employee.business_email.getValue(),
      contract_type: employee.contract_type,
      occupation: employee.occupation,
      start_date: employee.start_date,
      shutdown_date: employee.shutdown_date,
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
