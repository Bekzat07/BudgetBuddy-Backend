import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(email: string): Promise<User | undefined> {
    console.log('email', email);
    const res = await this.userModel.findOne({ email }).lean().exec();
    return res;
  }

  async findId(id: string) {
    const res = await this.userModel.findById(id).lean().exec();
    return res;
  }

  async create(userData: {
    email: string;
    password: string;
    phone?: string;
    name?: string;
  }): Promise<User> {
    const newUser = new this.userModel({
      ...userData,
    });
    return newUser.save();
  }

  async findAll(): Promise<User> {
    const result = await this.userModel.find().lean().exec();
    return result[0];
  }

  async updateResetCode(id: Types.ObjectId, resetCode: number, expiry: Date) {
    const result = await this.userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          resetCode,
          resetCodeExpiry: expiry,
        },
      },
      { new: true },
    );

    return result.save();
  }

  async updatePassword(id: Types.ObjectId, newPassword: any) {
    const result = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            password: newPassword,
          },
        },
        { new: true },
      )
      .exec();
    return result.save();
  }
}
