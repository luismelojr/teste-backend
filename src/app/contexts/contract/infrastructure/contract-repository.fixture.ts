import FixtureBuilderContainer from 'shared/test-helpers/fixture-builder-container';
import FixtureHelper from 'shared/test-helpers/fixture-helper';
import PlanBuilder from 'plan/infrastructure/plan.entity.builder';
import CompanyBuilder from 'company/infrastructure/company.entity.builder';
import PersonBuilder from 'person/infrastructure/person.entity.builder';
import CustomerEntityBuilder from 'customer/infrastructure/entities/builders/customer.entity.builder';
import ContractEntityBuilder from 'contract/infrastructure/entities/builders/contract.entity.builder';

const fbc = new FixtureBuilderContainer();

interface FakeData {
  plan: Record<string, any>
  company: Record<string, any>;
  person: Record<string, any>;
  customer: Record<string, any>;
  contract: Record<string, any>;
}

export const fakeData: FakeData = {
  plan: {},
  company: {},
  person: {},
  customer: {},
  contract: {},
};

const fixtures = [
  new PlanBuilder(fbc).mergeOnBuild(fakeData, 'plan'),
  new CompanyBuilder(fbc).mergeOnBuild(fakeData, 'company'),
  new PersonBuilder(fbc).mergeOnBuild(fakeData, 'person'),
  new CustomerEntityBuilder(fbc).mergeOnBuild(fakeData, 'customer'),
  new ContractEntityBuilder(fbc).mergeOnBuild(fakeData, 'contract'),
].map((f) => f.build());

export const loadFixtures = (dataSource): Promise<void> =>
  new FixtureHelper().loadFixtures({ fixtures, dataSource });
