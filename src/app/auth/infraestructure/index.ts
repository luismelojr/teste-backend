import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

export const infraestructure: any[] = [JwtStrategy, JwtAuthGuard, RolesGuard];
