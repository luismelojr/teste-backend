// Path: contract/infrastructure/entities/builders/contract.entity.builder.ts
import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import { FixtureBuilder } from 'shared/test-helpers/fixture-builder';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

const getDefaultObject = (c: FixtureBuilderContainer) => {
  return {
    entity: 'contracts',
    data: {
      id: c.contractId,
      uuid: generateUuidV4(),
      identifier: 'CT-001',
      description: 'Contrato anual de serviços',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      plan: { id: c.planId },
      company: { id: c.companyId },
    },
  };
};

export default class ContractEntityBuilder extends FixtureBuilder {
  constructor(fixtureContainer: FixtureBuilderContainer) {
    super();
    fixtureContainer.newContract();
    this.object = getDefaultObject(fixtureContainer);
  }
}
