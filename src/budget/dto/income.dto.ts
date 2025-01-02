import { IsNumber, IsString } from 'class-validator';

export class IncomesDto {
  @IsNumber()
  income: number;

  @IsString()
  userId: string;

  @IsString()
  currency: string;
}
