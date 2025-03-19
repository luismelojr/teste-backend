import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

export function ApiDeleteCustomer() {
  return applyDecorators(
    ApiTags('Customers'),
    ApiOperation({ summary: 'Remove um cliente existente pelo uuid' }),
    ApiParam({
      name: 'uuid',
      type: 'string',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({ description: 'Cliente removido com sucesso' }),
  );
}
