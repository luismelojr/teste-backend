import { IsNotEmpty } from 'class-validator';

export class RemoveUserGroupInput {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  group: string;
}
