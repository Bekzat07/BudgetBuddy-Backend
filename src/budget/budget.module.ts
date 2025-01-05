import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetSchema, Budget } from 'src/schemas/budget.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }]),
    UsersModule,
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
