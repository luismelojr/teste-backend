import { Inject, Injectable } from '@nestjs/common';
import { PlanRepository } from 'plan/infrastructure/plan.repository';
import { CompanyRepository } from 'company/infrastructure/company.repository';
import { PersonRepository } from 'person/infrastructure/person.repository';
import { executeCreateContractCommand } from './create/create-contract.command';

@Injectable()
export class ContractRelationFetch {
  constructor(
    @Inject(PlanRepository)
    private readonly planRepository: PlanRepository,
    @Inject(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
    @Inject(PersonRepository)
    private readonly personRepository: PersonRepository,
  ) {}

  async fetchRelations(command: executeCreateContractCommand) {
    const { plan: planData, company: companyData, person: personData } = command;

    const plan = await this.planRepository.findOneByUuid(planData.uuid);
    if (!plan) {
      throw new Error('Plan not found');
    }

    let company = undefined;
    if (companyData?.uuid) {
      company = await this.companyRepository.findOneByUuid(companyData.uuid);
      if (!company) {
        throw new Error('Company not found');
      }
    }

    let person = undefined;
    if (personData?.uuid) {
      person = await this.personRepository.findOneByUuid(personData.uuid);
      if (!person) {
        throw new Error('Person not found');
      }
    }

    if (!company && !person) {
      throw new Error('At least one of company or person must be provided');
    }

    return {
      plan: {
        id: plan.id,
        uuid: plan.uuid,
        name: plan.name,
        description: plan.description,
      },
      company: company ? {
        id: company.id,
        uuid: company.uuid,
        name: company.name,
        document: company.cnpj,
      } : undefined,
      person: person ? {
        id: person.id,
        uuid: person.uuid,
        name: person.name,
        document: person.cpf,
      } : undefined,
    };
  }
}
