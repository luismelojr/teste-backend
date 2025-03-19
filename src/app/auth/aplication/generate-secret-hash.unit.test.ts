import * as crypto from 'crypto';
import { generateSecretHash } from './generate-secret-hash';

jest.mock('crypto');

describe('generateSecretHash', () => {
  const mockCreateHmac = {
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue('mocked-hash'),
  };

  beforeEach(() => {
    (crypto.createHmac as jest.Mock).mockReturnValue(mockCreateHmac);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.COGNITO_APP_CLIENT_SECRET;
    delete process.env.COGNITO_APP_CLIENT_ID;
  });

  it('should generate a secret hash correctly', () => {
    process.env.COGNITO_APP_CLIENT_SECRET = 'mockSecret';
    process.env.COGNITO_APP_CLIENT_ID = 'mockClientId';

    const username = 'testuser';
    const expectedMessage = username + process.env.COGNITO_APP_CLIENT_ID;

    const result = generateSecretHash(username);

    expect(crypto.createHmac).toHaveBeenCalledWith('sha256', 'mockSecret');
    expect(mockCreateHmac.update).toHaveBeenCalledWith(expectedMessage);
    expect(mockCreateHmac.digest).toHaveBeenCalledWith('base64');
    expect(result).toBe('mocked-hash');
  });

  it('should throw an error if COGNITO_APP_CLIENT_SECRET is not defined', () => {
    process.env.COGNITO_APP_CLIENT_ID = 'mockClientId';

    const username = 'testuser';

    expect(() => generateSecretHash(username)).toThrowError(
      'COGNITO_APP_CLIENT_SECRET or COGNITO_APP_CLIENT_ID is not defined',
    );
  });

  it('should throw an error if COGNITO_APP_CLIENT_ID is not defined', () => {
    process.env.COGNITO_APP_CLIENT_SECRET = 'mockSecret';

    const username = 'testuser';

    expect(() => generateSecretHash(username)).toThrowError(
      'COGNITO_APP_CLIENT_SECRET or COGNITO_APP_CLIENT_ID is not defined',
    );
  });
});
