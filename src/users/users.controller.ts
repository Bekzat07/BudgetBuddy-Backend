import { Controller, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUser(@Request() req) {
    console.log('req,req', req.body.email);
    const result = await this.userService.findOne(req.body.email);
    return result;
  }
}
