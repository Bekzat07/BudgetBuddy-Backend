import { Exclude, Expose } from 'class-transformer';

export class AuthDto {
  @Expose()
  userId: number;

  @Expose()
  email: string;

  @Expose()
  accessToken?: string;

  @Expose()
  _id?: any;

  @Exclude()
  password: string;

  @Exclude()
  resetCode: number;

  @Exclude()
  resetCodeExpiry: Date;
}
