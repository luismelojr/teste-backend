import { Module } from '@nestjs/common';
import { AuthService } from './aplication/auth.service';
import { PassportModule } from '@nestjs/passport';
import { exportExempleController } from './exemple-guard/exemple-controller';
import { controllers } from './interface';
import { services } from './aplication';
import { infraestructure } from './infraestructure';
import { UserModule } from 'user/user.module';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), UserModule],
  controllers: [...controllers, ...exportExempleController],
  providers: [...services, ...infraestructure],
  exports: [AuthService],
})
export class AuthModule {
}
