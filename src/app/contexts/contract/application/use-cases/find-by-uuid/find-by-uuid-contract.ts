import { UUID } from 'shared/types/uuid';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { ContractRepository } from 'contract/infrastructure/contract.repository';
import { Output } from 'contract/application/use-cases/find-by-uuid/find-by-uuid-contract-output.type';
import { FindByUuidContractOutputAdapter } from 'contract/application/use-cases/find-by-uuid/find-by-uuid-contract-output.adapter';

interface executeCommand {
  uuid: UUID;
}

@Injectable()
export class FindByUuidContract extends UseCase {
  constructor(
    @Inject(ContractRepository)
    protected repository: ContractRepository,
  ) {
    super();
  }

  async execute(command: executeCommand): Promise<Output> {
    const { uuid } = command;

    if (!uuid) throw new BadRequestException('uuid is required');

    const contract = await this.repository.findOneByUuid(uuid);

    if (!contract) throw new NotFoundException('Contract is not found');

    return FindByUuidContractOutputAdapter.execute(contract);
  }
}
