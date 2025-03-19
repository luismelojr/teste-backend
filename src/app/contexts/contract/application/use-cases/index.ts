import { Provider } from '@nestjs/common';
import { CreateContract } from 'contract/application/use-cases/create/create-contract';
import { ContractRelationFetch } from 'contract/application/use-cases/contract-relation-fetch';
import { DeleteContract } from 'contract/application/use-cases/delete/delete-contract';
import { FindAllContracts } from 'contract/application/use-cases/find-all/find-all-contracts';
import { FindByUuidContract } from 'contract/application/use-cases/find-by-uuid/find-by-uuid-contract';

export const useCases: Provider[] = [
  CreateContract,
  DeleteContract,
  FindAllContracts,
  FindByUuidContract,
  ContractRelationFetch,
];
