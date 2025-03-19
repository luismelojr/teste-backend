import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserInput {
  @IsNotEmpty()
  cognitoId: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
