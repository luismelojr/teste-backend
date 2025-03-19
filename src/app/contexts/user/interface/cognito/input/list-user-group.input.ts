import { IsNotEmpty } from 'class-validator';

export class ListUserGroupInput {
  @IsNotEmpty()
  username: string;
}
