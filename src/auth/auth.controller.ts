import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
@Serialize(AuthDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  signUp(@Body() registerDto: any) {
    console.log('registerDto', registerDto);
    return this.authService.signUp(registerDto);
  }
}
