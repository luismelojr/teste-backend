export const AuthMockService = {
  authenticateUser: jest.fn().mockResolvedValue({
    user: {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      cognitoId: '123e4567-e89b-12d3-a456-426614174000',
      username: 'patria',
      email: 'patria@patria.com',
      name: 'patria teste',
    },
    accessToken: 'mocked-access-token',
    idToken: 'mocked-id-token',
    refreshToken: 'mocked-refresh-token',
    expiresIn: 3600,
    tokenType: 'Bearer',
  }),

  validateToken: jest.fn().mockResolvedValue({
    username: 'patria',
    groups: ['Admin'],
    attributes: {
      email: 'patria@patria.com',
      name: 'patria teste',
    },
  }),
};
