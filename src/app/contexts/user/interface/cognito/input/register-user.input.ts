import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserInput {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
