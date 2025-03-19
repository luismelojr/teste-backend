import { UUID } from 'shared/types/uuid';
import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export type CreateContractOutput = {
  id?: EntityPrimaryKey;
  uuid?: UUID;
  identifier: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  plan: {
    id: EntityPrimaryKey;
    uuid: UUID;
    name: string;
    description?: string;
  };
  company?: {
    id: EntityPrimaryKey;
    uuid: UUID;
    name: string;
    cnpj?: string;
  };
  person?: {
    id: EntityPrimaryKey;
    uuid: UUID;
    name: string;
    cpf?: string;
  };
  customerId?: EntityPrimaryKey;
  isActive: boolean;
  duration: number;
};
