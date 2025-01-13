import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(':chatId/getAllMessages')
  async getChats(@Param('chatId') userId) {
    return this.chatService.getMessages(userId);
  }
}
