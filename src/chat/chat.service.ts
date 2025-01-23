import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// schemas
import { Chat } from 'src/schemas/chat.schema';
import { Message } from 'src/schemas/message.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    private userService: UsersService,
  ) {}

  async sendMessage(senderId: string, receiverId: string, content: string) {
    const message = new this.messageModel({
      sender: senderId,
      receiver: receiverId,
      content,
    });
    await message.save();

    const participants = [senderId, receiverId].sort();
    const chat = await this.chatModel.findOneAndUpdate(
      { participants },
      { $push: { messages: message._id }, user: senderId },
      { new: true, upsert: true },
    );

    return { message, chat };
  }

  async getMessages(chatId: string) {
    try {
      const res = await this.chatModel
        .findById(chatId)
        .populate({
          path: 'messages',
          model: 'Message',
        })
        .exec();
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllChats(email: string) {
    try {
      const user = await this.userService.findOne(email);
      if (!user) {
        throw new Error('User not found');
      }
      const chats = await this.chatModel
        .find({ participants: user._id })
        .populate({
          path: 'user',
          model: 'User',
        });
      return chats;
    } catch (error) {
      throw new Error(error);
    }
  }
}
