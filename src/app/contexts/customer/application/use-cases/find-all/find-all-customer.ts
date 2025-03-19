import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'shared/abstracts/use-case';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  CustomerRepository,
} from 'customer/infrastructure/customer.repository';
import {
  FindAllCustomerOutputAdapter,
} from 'customer/application/use-cases/find-all/find-all-customer-output.adapter';
import { Customer } from 'customer/domain/customer';
import {
  FindAllCustomerType,
} from 'customer/application/use-cases/find-all/find-all-customer.type';

interface executeCommand {
  pagination?: PaginationInput;
  searchText?: string;
}

@Injectable()
export class FindAllCustomer extends UseCase {
  constructor(
    @Inject(CustomerRepository)
    protected repository: CustomerRepository,
  ) {
    super();
  }

  outputAdapter(result): FindAllCustomerType[] {
    return result.data.map((customer: Customer) => {
      return FindAllCustomerOutputAdapter.execute(customer);
    });
  }

  async execute(
    command: executeCommand,
  ): Promise<Output> {
    const { pagination, searchText } = command;

    const result = await this.repository.findAll({
      pagination,
      searchText,
    });

    return {
      data: this.outputAdapter(result),
      total: result.total,
    };

  }
}

type Output = {
  data: FindAllCustomerType[],
  total: number,
};
