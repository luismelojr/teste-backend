import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerOutput } from 'customer/interface/output/customer.output';
import {
  CreateCustomerInput,
} from 'customer/interface/input/create-customer.input';

export function ApiCreateCustomer() {
  return applyDecorators(
    ApiTags('Customers'),
    ApiOperation({ summary: 'Cria um novo cliente' }),
    ApiBody({ type: CreateCustomerInput }),
    ApiCreatedResponse({
      description: 'Cliente criado com sucesso',
      type: CustomerOutput,
    }),
  );
}
