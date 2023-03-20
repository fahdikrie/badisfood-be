import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';

import { AuthResponseDto } from './dto/auth.output';
import { RegisterUserDto } from './dto/register.input';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private userService: UsersService) {}

  validatePassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUser({ username: username });

    if (user && this.validatePassword(password, user.password)) {
      delete user.password;
      return user;
    }

    return null;
  }

  async validateUserById(userId: string): Promise<any> {
    const user = await this.userService.findUser({ id: userId });

    if (user) {
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
      const message = `User ${registerUserDto.username} already exists`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    const user = await this.userService.createUser(registerUserDto);
    delete user.password;

    return {
      user,
    };
  }

  async login(user: User): Promise<any> {
    return user;
  }
}
