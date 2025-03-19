import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerOutput } from 'customer/interface/output/customer.output';
import {
  UpdateCustomerInput
} from 'customer/interface/input/update-customer.input';

export function ApiUpdateCustomer() {
  return applyDecorators(
    ApiTags('Customers'),
    ApiOperation({ summary: 'Atualiza um cliente existente' }),
    ApiBody({ type: UpdateCustomerInput }),
    ApiOkResponse({
      description: 'Cliente atualizado com sucesso',
      type: CustomerOutput,
    }),
  );
}
