import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@UseGuards(AuthGuard)
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('getUser')
  async getUser(@Request() req) {
    const result = await this.userService.findOne(req.user.email);
    return result;
  }

  @Post(':userId/profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Param('userId') userId: string,
    @UploadedFile() file: any,
  ) {
    const imageUrl = await this.userService.uploadFile(file, userId);
    return { userId, image: imageUrl };
  }
}
