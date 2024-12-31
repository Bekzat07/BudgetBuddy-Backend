import { Body, Controller, Post } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { ExpensesDto } from './expenses.dto';

@Controller('budget')
export class BudgetController {
  constructor(private budgetService: BudgetService) {}
  @Post('/addExpenses')
  async addExpenses(@Body() expensesDto: ExpensesDto) {
    return await this.budgetService.addExpenses(expensesDto);
  }
}
