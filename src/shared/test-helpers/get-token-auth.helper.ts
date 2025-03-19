import { INestApplication } from '@nestjs/common';
import { AuthService } from 'auth/aplication/auth.service';

export async function getAuthToken(
  app: INestApplication,
  username: string,
  password: string,
): Promise<string> {
  const authService = app.get(AuthService);
  const authResponse = await authService.authenticateUser(
    username,
    password,
  );
  return authResponse.access_token;
}
