import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

// modules
import { BudgetModule } from './budget/budget.module';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';

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
    BudgetModule,
    ChatModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
