import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { ExpensesDto } from './dto/expenses.dto';
import { IncomesDto } from './dto/income.dto';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('budget')
@UseGuards(AuthGuard)
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

  @Get()
  async getBudget(@Request() req) {
    return await this.budgetService.getBudget(req.user.email);
  }
}
