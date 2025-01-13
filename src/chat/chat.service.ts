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

    const chat = await this.chatModel.findOneAndUpdate(
      { participants: { $all: [senderId, receiverId] } },
      { $push: { messages: message._id } },
      { new: true, upsert: true },
    );

    return { message, chat };
  }

  async getMessages(chatId: string) {
    return this.chatModel.findById(chatId).populate('messages');
  }
}
