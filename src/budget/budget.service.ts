import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Budget } from 'src/schemas/budget.schema';

// dto
import { ExpensesDto } from './expenses.dto';

@Injectable()
export class BudgetService {
  constructor(@InjectModel(Budget.name) private userModel: Model<Budget>) {}

  async findOne(email: string): Promise<Budget | undefined> {
    const res = await this.userModel.findOne({ email }).lean().exec();
    return res;
  }

  async addExpenses(budgetData: ExpensesDto) {
    if (!budgetData) {
      throw new UnauthorizedException();
    }
    const newUser = new this.userModel({
      expenses: [budgetData.expenses],
      userId: budgetData.userId,
      currency: budgetData.currency,
      income: [],
    });
    return newUser.save();
  }
}
