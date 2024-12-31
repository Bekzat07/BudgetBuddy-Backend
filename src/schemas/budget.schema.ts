import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BudgetDocument = HydratedDocument<Budget>;

@Schema()
export class Budget {
  @Prop()
  expenses: number[];

  @Prop()
  income: number[];

  @Prop({ default: new Date() })
  date: Date;

  @Prop()
  currency: string;

  _id: Types.ObjectId;

  @Prop()
  userId: string;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
