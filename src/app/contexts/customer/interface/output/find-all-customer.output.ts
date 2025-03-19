import { ApiProperty } from '@nestjs/swagger';
import { CustomerOutput } from 'customer/interface/output/customer.output';

export class FindAllCustomerOutput {
  @ApiProperty({ type: CustomerOutput })
  data: CustomerOutput[];

  @ApiProperty({ example: 2 })
  total: number;

}
