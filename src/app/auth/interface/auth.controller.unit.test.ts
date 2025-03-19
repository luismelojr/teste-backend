import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../aplication/auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authenticateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call AuthService.authenticateUser with correct parameters', async () => {
      const mockBody = { username: 'testuser', password: 'testpassword' };
      const mockResult = { accessToken: 'mockAccessToken' };

      jest.spyOn(authService, 'authenticateUser').mockResolvedValue(mockResult);

      const result = await authController.login(mockBody);

      expect(authService.authenticateUser).toHaveBeenCalledWith(
        'testuser',
        'testpassword',
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if AuthService.authenticateUser fails', async () => {
      const mockBody = { username: 'testuser', password: 'wrongpassword' };

      jest
        .spyOn(authService, 'authenticateUser')
        .mockRejectedValue(new Error('Invalid credentials'));

      await expect(authController.login(mockBody)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
