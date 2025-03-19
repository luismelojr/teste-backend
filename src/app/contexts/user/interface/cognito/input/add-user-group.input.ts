import { IsNotEmpty } from 'class-validator';

export class AddUserGroupInput {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  group: string;
}
