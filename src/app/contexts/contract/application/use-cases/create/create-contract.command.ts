import { UUID } from 'shared/types/uuid';

export interface executeCreateContractCommand {
  identifier: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  plan: {
    uuid: UUID;
    name?: string;
  };
  company?: {
    uuid: UUID;
    name?: string;
  };
  person?: {
    uuid: UUID;
    name?: string;
  };
}
