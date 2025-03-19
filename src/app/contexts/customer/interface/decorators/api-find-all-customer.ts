import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindAllCustomerOutput,
} from 'customer/interface/output/find-all-customer.output';

export function ApiFindByUuidCustomer() {
  return applyDecorators(
    ApiTags('Customers'),
    ApiOperation({ summary: 'Busca clientes com paginação' }),
    ApiQuery({
      name: 'page',
      required: false,
      example: 1,
      description: 'Número da página',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      example: 10,
      description: 'Quantidade de itens por página',
    }),
    ApiQuery({
      name: 'searchText',
      required: false,
      description: 'Texto para busca',
    }),
    ApiOkResponse({
      description: 'Lista de clientes',
      type: FindAllCustomerOutput,
    }),
  );
}
