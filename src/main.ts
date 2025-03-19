import { NestFactory } from '@nestjs/core';
import { AppModule, configureApp } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT') || 3000;

  configureApp(app);
  await app.listen(port);
}

bootstrap();
