import { Contract } from './contract';
import { generateUuidV4 } from 'shared/helpers/uuid-v4';

describe('Contract Domain', () => {
  const validPlanProps = {
    id: '1',
    uuid: generateUuidV4(),
    name: 'Premium Plan',
  };

  const validCompanyProps = {
    id: '2',
    uuid: generateUuidV4(),
    name: 'ACME Corporation',
    document: '12.345.678/0001-90',
  };

  const validPersonProps = {
    id: '3',
    uuid: generateUuidV4(),
    name: 'John Doe',
    document: '123.456.789-00',
  };

  const validStartDate = new Date('2025-01-01');
  const validEndDate = new Date('2025-12-31');

  it('should create a valid contract with company', () => {
    const contract = Contract.create({
      identifier: 'CT-001',
      description: 'Annual subscription',
      startDate: validStartDate,
      endDate: validEndDate,
      plan: validPlanProps,
      company: validCompanyProps,
    });

    expect(contract).toBeDefined();
    expect(contract.identifier).toBe('CT-001');
    expect(contract.description).toBe('Annual subscription');
    expect(contract.startDate).toEqual(validStartDate);
    expect(contract.endDate).toEqual(validEndDate);
    expect(contract.plan.id).toBe(validPlanProps.id);
    expect(contract.plan.name).toBe(validPlanProps.name);
    expect(contract.company).toBeDefined();
    expect(contract.company.id).toBe(validCompanyProps.id);
    expect(contract.company.name).toBe(validCompanyProps.name);
    expect(contract.person).toBeUndefined();
    expect(contract.hasCompany).toBe(true);
    expect(contract.hasPerson).toBe(false);
    expect(contract.customerId).toBeUndefined();
    expect(contract.hasCustomer).toBe(false);
  });

  it('should create a valid contract with person', () => {
    const contract = Contract.create({
      identifier: 'CT-002',
      startDate: validStartDate,
      endDate: validEndDate,
      plan: validPlanProps,
      person: validPersonProps,
    });

    expect(contract).toBeDefined();
    expect(contract.identifier).toBe('CT-002');
    expect(contract.plan.name).toBe(validPlanProps.name);
    expect(contract.person).toBeDefined();
    expect(contract.person.id).toBe(validPersonProps.id);
    expect(contract.person.name).toBe(validPersonProps.name);
    expect(contract.company).toBeUndefined();
    expect(contract.hasPerson).toBe(true);
    expect(contract.hasCompany).toBe(false);
  });

  it('should throw error if start date is after end date', () => {
    expect(() => {
      Contract.create({
        identifier: 'CT-003',
        startDate: new Date('2025-12-31'),
        endDate: new Date('2025-01-01'),
        plan: validPlanProps,
        company: validCompanyProps,
      });
    }).toThrow('A data de início deve ser anterior à data de término.');
  });

  it('should throw error if neither company nor person is provided', () => {
    expect(() => {
      Contract.create({
        identifier: 'CT-004',
        startDate: validStartDate,
        endDate: validEndDate,
        plan: validPlanProps,
      });
    }).toThrow('Contrato deve ter uma empresa ou pessoa associada.');
  });

  it('should calculate contract duration correctly', () => {
    const contract = Contract.create({
      identifier: 'CT-005',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-31'),
      plan: validPlanProps,
      company: validCompanyProps,
    });

    expect(contract.duration).toBe(30); // 30 days
  });

  it('should determine if contract is active', () => {
    const pastContract = Contract.create({
      identifier: 'CT-006',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2020-12-31'),
      plan: validPlanProps,
      company: validCompanyProps,
    });

    const futureContract = Contract.create({
      identifier: 'CT-007',
      startDate: new Date('2030-01-01'),
      endDate: new Date('2030-12-31'),
      plan: validPlanProps,
      company: validCompanyProps,
    });

    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const sixMonthsFromNow = new Date(now);
    sixMonthsFromNow.setMonth(now.getMonth() + 6);

    const activeContract = Contract.create({
      identifier: 'CT-008',
      startDate: sixMonthsAgo,
      endDate: sixMonthsFromNow,
      plan: validPlanProps,
      company: validCompanyProps,
    });

    expect(pastContract.isActive).toBe(false);
    expect(futureContract.isActive).toBe(false);
    expect(activeContract.isActive).toBe(true);
  });

  describe('createCustomer', () => {
    it('should create a customer from contract with company', () => {
      const contract = Contract.create({
        identifier: 'CT-009',
        startDate: validStartDate,
        endDate: validEndDate,
        plan: validPlanProps,
        company: validCompanyProps,
      });

      const customer = contract.createCustomer();

      expect(customer).toBeDefined();
      expect(customer.identifier).toBe(validCompanyProps.name);
      expect(customer.groupIdentifier).toBe('CT-009');
      expect(customer.grainConsumer.isConsumer).toBe(false);
    });

    it('should create a customer from contract with person', () => {
      const contract = Contract.create({
        identifier: 'CT-010',
        startDate: validStartDate,
        endDate: validEndDate,
        plan: validPlanProps,
        person: validPersonProps,
      });

      const customer = contract.createCustomer();

      expect(customer).toBeDefined();
      expect(customer.identifier).toBe(validPersonProps.name);
      expect(customer.groupIdentifier).toBe('CT-010');
    });

    it('should throw if trying to create customer without company or person', () => {
      const mockContract = Object.create(Contract.prototype);
      mockContract._company = undefined;
      mockContract._person = undefined;
      mockContract._identifier = 'CT-011';

      expect(() => {
        Contract.prototype.createCustomer.call(mockContract);
      }).toThrow('Não foi possível criar o cliente.');
    });
  });

  describe('linkToCustomer', () => {
    it('should link a contract to a customer', () => {
      const customerId = '123';
      const contract = Contract.create({
        identifier: 'CT-012',
        startDate: validStartDate,
        endDate: validEndDate,
        plan: validPlanProps,
        company: validCompanyProps,
      });

      const updatedContract = contract.linkToCustomer(customerId);

      expect(updatedContract).toBeDefined();
      expect(updatedContract.customerId).toBe(customerId);
      expect(updatedContract.hasCustomer).toBe(true);

      expect(updatedContract.identifier).toBe(contract.identifier);
      expect(updatedContract.plan.id).toBe(contract.plan.id);
      expect(updatedContract.company.id).toBe(contract.company.id);
    });

    it('should create a new contract instance when linking to customer', () => {
      const customerId = '456';
      const contract = Contract.create({
        identifier: 'CT-013',
        startDate: validStartDate,
        endDate: validEndDate,
        plan: validPlanProps,
        person: validPersonProps,
      });

      const updatedContract = contract.linkToCustomer(customerId);

      expect(updatedContract).not.toBe(contract);

      expect(contract.customerId).toBeUndefined();
      expect(contract.hasCustomer).toBe(false);

      expect(updatedContract.customerId).toBe(customerId);
      expect(updatedContract.hasCustomer).toBe(true);
    });
  });

  describe('contract with customerId', () => {
    it('should create a contract already linked to a customer', () => {
      const customerId = '789';
      const contract = Contract.create({
        identifier: 'CT-014',
        startDate: validStartDate,
        endDate: validEndDate,
        plan: validPlanProps,
        company: validCompanyProps,
        customerId: customerId
      });

      expect(contract.customerId).toBe(customerId);
      expect(contract.hasCustomer).toBe(true);
    });
  });
});
