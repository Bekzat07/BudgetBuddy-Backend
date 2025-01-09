import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { promisify } from 'util';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findOne(email.toLowerCase());

    if (!user) {
      throw new UnauthorizedException();
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(pass, salt, 32)) as Buffer;
    if (storedHash != hash.toString('hex')) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user._id,
      email: user.email.toLowerCase(),
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const userWithToken = {
      ...user,
      accessToken: token,
      refreshToken,
    };

    return userWithToken;
  }

  async signUp({
    email,
    password,
    phone,
    name,
  }: {
    email: string;
    password: string;
    phone: string;
    name: string;
  }) {
    const user = await this.usersService.findOne(email.toLowerCase());
    if (!user) {
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      const hashPassword = salt + '.' + hash.toString('hex');
      const result = await this.usersService.create({
        name,
        email: email.toLowerCase(),
        password: hashPassword,
        phone,
      });
      return result;
    }
    throw new UnauthorizedException('Email already exists');
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async generateToken(payload: { email: string; sub: string }) {
    const token = await this.jwtService.signAsync(
      { email: payload.email, sub: payload.sub },
      {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '1h',
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { email: payload.email, sub: payload.sub },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );
    return { accessToken: token, refreshToken };
  }
  async sendResetCode(email: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const otp = Math.floor(1000 + Math.random() * 9000);

    const otpExpier = new Date();
    otpExpier.setMinutes(otpExpier.getMinutes() + 2);
    await this.usersService.updateResetCode(user._id, otp, otpExpier);

    const transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRUP_EMAIL,
        pass: process.env.MAILTRUP_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: email,
      from: 'jaiq.dev.com',
      subject: 'Password Reset Code',
      text: `Your password reset code is ${otp}. It will expire in 1 hour.`,
    });
    return { message: 'Password reset code sent to email' };
  }

  async resetPassword(otp: number, username: string, newPassword: string) {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.resetCode !== otp || user.resetCodeExpiry < new Date()) {
      throw new UnauthorizedException('Invalid OTP or OTP expired');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(newPassword, salt, 32)) as Buffer;
    const hashPassword = salt + '.' + hash.toString('hex');

    await this.usersService.updatePassword(user._id, hashPassword);

    return { message: 'Password reset successfully' };
  }
}
