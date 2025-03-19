import * as crypto from 'crypto';

export function generateSecretHash(username: string): string {
  const secret = process.env.COGNITO_APP_CLIENT_SECRET;
  const clientId = process.env.COGNITO_APP_CLIENT_ID;

  if (!secret || !clientId) {
    throw new Error(
      'COGNITO_APP_CLIENT_SECRET or COGNITO_APP_CLIENT_ID is not defined',
    );
  }

  const message = username + clientId;

  return crypto.createHmac('sha256', secret).update(message).digest('base64');
}
