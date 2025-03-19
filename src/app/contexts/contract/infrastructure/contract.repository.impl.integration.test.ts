// Path: contract/infrastructure/contract.repository.impl.integration.test.ts
import {
  IntegrationTestContext,
  setupIntegrationTest,
} from 'shared/test-helpers/test-integration-setup.helper';
import { ContractRepository } from 'contract/infrastructure/contract.repository';
import { plan, company, person } from 'contract/infrastructure/contract-mock';
import { Contract } from 'contract/domain/contract';
import { fakeData, loadFixtures } from 'contract/infrastructure/contract-repository.fixture';

describe('ContractRepositoryImpl', () => {
  let ctx: IntegrationTestContext;
  let repository: ContractRepository;

  beforeEach(async () => {
    ctx = await setupIntegrationTest(loadFixtures);
    repository = ctx.app.get<ContractRepository>(ContractRepository);
  });

  afterEach(async () => {
    await ctx.cleanup();
  });

  describe('Create', () => {
    it('create to be a defined', async () => {
      expect(repository.create).toBeDefined();
    });

    it('should create a contract with company', async () => {
      const contractWithCompany = new Contract({
        identifier: 'CT-001',
        description: 'Contrato anual',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      const saved = await repository.create(contractWithCompany);
      expect(saved.identifier).toEqual(contractWithCompany.identifier);
      expect(saved.description).toEqual(contractWithCompany.description);
      expect(saved.startDate).toEqual(contractWithCompany.startDate);
      expect(saved.endDate).toEqual(contractWithCompany.endDate);
      expect(saved.plan.id).toEqual(contractWithCompany.plan.id);
      expect(saved.company.id).toEqual(contractWithCompany.company.id);
      expect(saved.person).toBeUndefined();
    });

    it('should create a contract with person', async () => {
      const contractWithPerson = new Contract({
        identifier: 'CT-002',
        description: 'Contrato mensal',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        person: person,
      });

      const saved = await repository.create(contractWithPerson);
      expect(saved.identifier).toEqual(contractWithPerson.identifier);
      expect(saved.description).toEqual(contractWithPerson.description);
      expect(saved.startDate).toEqual(contractWithPerson.startDate);
      expect(saved.endDate).toEqual(contractWithPerson.endDate);
      expect(saved.plan.id).toEqual(contractWithPerson.plan.id);
      expect(saved.person.id).toEqual(contractWithPerson.person.id);
      expect(saved.company).toBeUndefined();
    });

    it('should create a contract linked to a customer', async () => {
      const contractWithCustomer = new Contract({
        identifier: 'CT-003',
        description: 'Contrato com cliente',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
        customerId: fakeData.customer.id,
      });

      const saved = await repository.create(contractWithCustomer);
      expect(saved.identifier).toEqual(contractWithCustomer.identifier);
      expect(saved.customerId).toEqual(contractWithCustomer.customerId);
      expect(saved.hasCustomer).toBe(true);
    });
  });

  describe('Update', () => {
    it('should update contract details', async () => {
      // Primeiro criamos um contrato
      const newContract = new Contract({
        identifier: 'CT-UPDATE',
        description: 'Contrato para atualização',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      const saved = await repository.create(newContract);

      // Atualizamos o contrato
      const contractToUpdate = new Contract({
        id: saved.id,
        uuid: saved.uuid,
        identifier: 'CT-UPDATED',
        description: 'Contrato atualizado',
        startDate: new Date('2023-02-01'),
        endDate: new Date('2023-11-30'),
        plan: saved.plan,
        company: saved.company,
      });

      const updated = await repository.update(contractToUpdate);

      expect(updated.id).toEqual(saved.id);
      expect(updated.uuid).toEqual(saved.uuid);
      expect(updated.identifier).toEqual('CT-UPDATED');
      expect(updated.description).toEqual('Contrato atualizado');
      expect(updated.startDate).toEqual(new Date('2023-02-01'));
      expect(updated.endDate).toEqual(new Date('2023-11-30'));
    });

    it('should link contract to customer', async () => {
      // Primeiro criamos um contrato sem customer
      const newContract = new Contract({
        identifier: 'CT-LINK',
        description: 'Contrato para vincular',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      const saved = await repository.create(newContract);
      expect(saved.customerId).toBeUndefined();

      // Atualizamos com customer
      const contractToUpdate = new Contract({
        id: saved.id,
        uuid: saved.uuid,
        identifier: saved.identifier,
        description: saved.description,
        startDate: saved.startDate,
        endDate: saved.endDate,
        plan: saved.plan,
        company: saved.company,
        customerId: fakeData.customer.id,
      });

      const updated = await repository.update(contractToUpdate);

      expect(updated.customerId).toEqual(fakeData.customer.id);
      expect(updated.hasCustomer).toBe(true);
    });
  });

  describe('Delete', () => {
    it('should remove contract with soft-delete', async () => {
      // Primeiro criamos um contrato
      const newContract = new Contract({
        identifier: 'CT-DELETE',
        description: 'Contrato para exclusão',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      const saved = await repository.create(newContract);

      // Excluímos o contrato
      await repository.delete(saved.uuid);

      // Verificamos se foi excluído (soft-delete)
      const contractDeletedAt = await ctx.dataSource.query(
        ` SELECT deleted_at
          FROM contracts
          WHERE uuid = '${saved.uuid}'
        `
      );

      expect(contractDeletedAt).not.toBeNull();
      expect(contractDeletedAt[0].deleted_at).toBeInstanceOf(Date);
    });
  });

  describe('Find', () => {
    it('should find contract by id', async () => {
      // Primeiro criamos um contrato
      const newContract = new Contract({
        identifier: 'CT-FIND',
        description: 'Contrato para busca',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      const saved = await repository.create(newContract);

      // Buscamos pelo ID
      const found = await repository.findOneById(saved.id);

      expect(found).toBeDefined();
      expect(found.id).toEqual(saved.id);
      expect(found.identifier).toEqual('CT-FIND');
    });

    it('should find contract by uuid', async () => {
      // Primeiro criamos um contrato
      const newContract = new Contract({
        identifier: 'CT-FIND-UUID',
        description: 'Contrato para busca por UUID',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      const saved = await repository.create(newContract);

      // Buscamos pelo UUID
      const found = await repository.findOneByUuid(saved.uuid);

      expect(found).toBeDefined();
      expect(found.uuid).toEqual(saved.uuid);
      expect(found.identifier).toEqual('CT-FIND-UUID');
    });

    it('should find all contracts with pagination', async () => {
      // Criamos alguns contratos
      const contract1 = new Contract({
        identifier: 'CT-ALL-1',
        description: 'Contrato para listagem 1',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      const contract2 = new Contract({
        identifier: 'CT-ALL-2',
        description: 'Contrato para listagem 2',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      await repository.create(contract1);
      await repository.create(contract2);

      // Buscamos com paginação
      const pagination = { page: 1, maxPageSize: 10 };
      const result = await repository.findAll({ pagination });

      expect(result.data.length).toBeGreaterThanOrEqual(2);
      expect(result.total).toBeGreaterThanOrEqual(2);

      const foundContract1 = result.data.find(c => c.identifier === 'CT-ALL-1');
      const foundContract2 = result.data.find(c => c.identifier === 'CT-ALL-2');

      expect(foundContract1).toBeDefined();
      expect(foundContract2).toBeDefined();
    });

    it('should find contracts by customerId', async () => {
      // Criamos um contrato vinculado a um cliente
      const newContract = new Contract({
        identifier: 'CT-CUSTOMER',
        description: 'Contrato vinculado a cliente',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
        customerId: fakeData.customer.id,
      });

      await repository.create(newContract);

      // Buscamos contratos pelo customerId
      const contracts = await repository.findByCustomerId(fakeData.customer.id);

      expect(contracts.length).toBeGreaterThanOrEqual(1);

      const foundContract = contracts.find(c => c.identifier === 'CT-CUSTOMER');
      expect(foundContract).toBeDefined();
      expect(foundContract.customerId).toEqual(fakeData.customer.id);
    });
  });

  describe('findAutocomplete', () => {
    it('should return autocomplete results', async () => {
      // Criamos um contrato para o autocomplete
      const autoContract = new Contract({
        identifier: 'CT-AUTO-TEST',
        description: 'Contrato para autocomplete',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        plan: plan,
        company: company,
      });

      await repository.create(autoContract);

      // Testamos o autocomplete
      const results = await repository.findAutocomplete('AUTO');

      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some(r => r.name === 'CT-AUTO-TEST')).toBeTruthy();
    });
  });
});
