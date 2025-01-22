import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(':chatId/getAllMessages')
  async getChat(@Param('chatId') userId) {
    return this.chatService.getMessages(userId);
  }

  @Get('/getAllChats')
  async getAllChats(@Request() req) {
    return this.chatService.getAllChats(req.user.email);
  }
}
