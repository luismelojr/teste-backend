import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export interface ContractSummary {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  identifier: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  plan: {
    id: EntityPrimaryKey;
    uuid: UUID;
    name: string;
  };
  company?: {
    id: EntityPrimaryKey;
    uuid: UUID;
    name: string;
  };
  person?: {
    id: EntityPrimaryKey;
    uuid: UUID;
    name: string;
  };
  customerId?: EntityPrimaryKey;
}

export interface FindAllContractsOutput {
  data: ContractSummary[];
  total: number;
}
