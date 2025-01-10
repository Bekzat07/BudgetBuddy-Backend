import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
  }

  async uploadFile(file: any, userId: string): Promise<string> {
    const bucket = admin.storage().bucket();

    const fileName = `${uuidv4()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    const response = new Promise<string>((resolve, reject) => {
      stream
        .on('finish', async () => {
          const [url] = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '03-09-2500',
          });
          resolve(url);
        })
        .on('error', (err) => {
          reject(`Failed to upload file: ${err.message}`);
        })
        .end(file.buffer);
    });
    const result = await response;
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { image: result } },
      { new: true },
    );
    return result;
  }

  async findOne(email: string): Promise<User | undefined> {
    const res = await this.userModel.findOne({ email }).lean().exec();
    const user = res ? { ...res, _id: res?._id.toString() } : null;
    return user;
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

  async updateResetCode(id: string, resetCode: number, expiry: Date) {
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

  async updatePassword(id: string, newPassword: any) {
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

  async findByName(name: string) {
    const user = await this.userModel
      .findOne({ name: { $regex: new RegExp(name, 'i') } })
      .lean()
      .exec();
    return user;
  }
}
