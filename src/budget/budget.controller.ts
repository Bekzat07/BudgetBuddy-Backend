import { Body, Controller, Post } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { ExpensesDto } from './dto/expenses.dto';
import { IncomesDto } from './dto/income.dto';

@Controller('budget')
export class BudgetController {
  constructor(private budgetService: BudgetService) {}
  @Post('/addExpense')
  async addExpenses(@Body() expensesDto: ExpensesDto) {
    return await this.budgetService.addExpense(expensesDto);
  }
  @Post('/addIncome')
  async addIncomes(@Body() incomeDto: IncomesDto) {
    return await this.budgetService.addIncome(incomeDto);
  }
}
