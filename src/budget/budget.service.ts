import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Budget } from 'src/schemas/budget.schema';

// dto
import { ExpensesDto } from './dto/expenses.dto';
import { IncomesDto } from './dto/income.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name) private BudgetModel: Model<Budget>,
    private userService: UsersService,
  ) {}

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
      incomes: [budgetData.income],
    });
    return db.save();
  }

  async getBudget(email: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const budget = await this.BudgetModel.findOne({ userId: user._id });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    return budget;
  }
}
