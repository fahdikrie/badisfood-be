import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';

import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  validatePassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  async validateUser(userData: User): Promise<any> {
    const user = await this.userService.findUser(userData);

    if (user && this.validatePassword(userData.password, user.password)) {
      delete user.password;
      return user;
    }

    return null;
  }

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    const userExists = await this.userService.findUser({
      username: registerUserDto.username,
    });

    if (userExists) {
      return {
        user: userExists,
      };
    }

    const user = await this.userService.createUser(registerUserDto);
    delete user.password;

    return {
      user,
    };
  }

  async login(user: User): Promise<any> {
    const payload = await this.validateUser(user);

    if (!payload) {
      return {
        statusCode: 401,
        message: 'Invalid credentials',
      };
    }

    return {
      statusCode: 200,
      message: 'Login successful',
      user: payload,
    };
  }
}
