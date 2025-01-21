import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// schemas
import { Chat } from 'src/schemas/chat.schema';
import { Message } from 'src/schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
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
      { $push: { messages: message._id } },
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
      console.error('Error populating messages:', error);
      throw error;
    }
  }
}
