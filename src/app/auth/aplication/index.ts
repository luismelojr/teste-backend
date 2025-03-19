import { Provider } from '@nestjs/common';
import { AuthService } from './auth.service';

export const services: Provider[] = [AuthService];
