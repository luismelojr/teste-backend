import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import {
  EmployeeRepository
} from '../../../infrastructure/employee.repository';
import { UUID } from 'shared/types/uuid';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class DeleteEmployee extends UseCase {
  constructor(
    @Inject(EmployeeRepository)
    protected readonly repository: EmployeeRepository,
  ) {
    super();
  }

  async execute(command: executeCommand): Promise<void> {
    const {uuid} = command;

    if (!uuid) {
      throw new BadRequestException('Employee UUID is required');
    }

    const employeeDB = await this.repository.findOneByUuid(uuid);

    if (!employeeDB) {
      throw new BadRequestException('Employee not found');
    }

    await this.repository.delete(uuid);
  }
}
