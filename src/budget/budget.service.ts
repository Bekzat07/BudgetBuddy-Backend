import { Injectable } from '@nestjs/common';
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
    const budget = await this.BudgetModel.findOne({
      userId: budgetData.userId,
    }).exec();
    if (budget) {
      budget.expenses.push(budgetData.expenses);
      return budget.save();
    }
    const db = new this.BudgetModel({
      expenses: [budgetData.expenses],
      userId: budgetData.userId,
      currency: budgetData.currency,
      incomes: [],
    });
    return db.save();
  }

  async addIncome(budgetData: IncomesDto) {
    const budget = await this.BudgetModel.findOne({
      userId: budgetData.userId,
    }).exec();
    if (budget) {
      budget.incomes.push(budgetData.income);
      return budget.save();
    }
    const db = new this.BudgetModel({
      userId: budgetData.userId,
      currency: budgetData.currency,
      income: [budgetData.income],
    });
    return db.save();
  }
}
