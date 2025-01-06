import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  userId: number;

  @Expose()
  email: string;

  @Expose()
  image: string;

  @Expose()
  accessToken?: string;

  @Expose()
  _id?: any;

  @Exclude()
  password: string;

  @Expose()
  phone: string;

  @Expose()
  name: string;
}
