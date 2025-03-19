import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflectorMock: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflectorMock = {
      getAllAndOverride: jest.fn(),
    } as any;

    rolesGuard = new RolesGuard(reflectorMock);
  });

  function createMockExecutionContext(user: any): ExecutionContext {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({ user }),
    } as any;
  }

  it('should return true if no roles are required', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);

    const mockContext = createMockExecutionContext({ groups: ['user'] });

    const result = rolesGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should allow access if user has a required role with sufficient priority', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(['user']);

    const mockContext = createMockExecutionContext({ groups: ['manager'] });

    const result = rolesGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should deny access if user does not have a required role', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(['admin']);

    const mockContext = createMockExecutionContext({ groups: ['user'] });

    const result = rolesGuard.canActivate(mockContext);

    expect(result).toBe(false);
  });

  it('should allow access if user has multiple roles and meets one required role', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(['user', 'manager']);

    const mockContext = createMockExecutionContext({ groups: ['admin'] });

    const result = rolesGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });
});
