import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  resetCode: number;

  @Prop()
  image: string;

  @Prop()
  resetCodeExpiry: Date;

  _id: string;

  @Prop()
  phone: string;

  @Prop()
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
