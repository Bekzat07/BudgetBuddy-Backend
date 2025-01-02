import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Budget } from 'src/schemas/budget.schema';

// dto
import { ExpensesDto } from './dto/expenses.dto';
import { IncomesDto } from './dto/income.dto';

@Injectable()
export class BudgetService {
  constructor(@InjectModel(Budget.name) private BudgetModel: Model<Budget>) {}

  async addExpense(budgetData: ExpensesDto) {
    if (!budgetData) {
      throw new UnauthorizedException();
    }
    const newUser = new this.BudgetModel({
      expenses: [budgetData.expenses],
      userId: budgetData.userId,
      currency: budgetData.currency,
      incomes: [],
    });
    return newUser.save();
  }

  async addIncome(budgetData: IncomesDto) {
    if (!budgetData) {
      throw new UnauthorizedException();
    }
    const newUser = new this.BudgetModel({
      userId: budgetData.userId,
      currency: budgetData.currency,
      income: [budgetData.income],
    });
    return newUser.save();
  }
}
