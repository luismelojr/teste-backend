import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerOutput } from 'customer/interface/output/customer.output';

export function ApiFindByUuidCustomer() {
  return applyDecorators(
    ApiTags('Customers'),
    ApiOperation({ summary: 'Busca um cliente pelo uuid' }),
    ApiParam({
      name: 'uuid',
      type: 'string',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Lista de clientes',
      type: CustomerOutput,
    }),
  );
}
