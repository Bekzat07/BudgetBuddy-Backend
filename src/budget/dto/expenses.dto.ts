import { IsNumber, IsString } from 'class-validator';

export class ExpensesDto {
  @IsNumber()
  expenses: number;

  @IsString()
  userId: string;

  @IsString()
  currency: string;
}
