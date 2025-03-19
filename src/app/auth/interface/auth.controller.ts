import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from '../aplication/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.authService.authenticateUser(username, password);
  }

  @HttpCode(HttpStatus.OK)
  @Get('validate-token')
  async validateToken(@Request() request) {
    const authorization = request.headers['authorization'];
    const token = authorization.substring(7, authorization.length);

    return this.authService.validateToken(token);
  }
}
