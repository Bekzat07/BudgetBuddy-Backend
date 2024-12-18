import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DB_URL environment variable is not defined');
}

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forRoot(dbUrl, {
      serverSelectionTimeoutMS: 5000,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
