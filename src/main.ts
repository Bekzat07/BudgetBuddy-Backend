import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function bootstrap() {
  const port = process.env.PORT || 3000;
  console.log(
    'process.env.FIREBASE_SERVICE_ACCOUNT',
    process.env.FIREBASE_SERVICE_ACCOUNT,
  );

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(port, '0.0.0.0');
}
bootstrap();
