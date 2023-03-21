import { User } from '@prisma/client';

export class AuthResponseDto {
  user: User;
  refreshToken?: string;
  accessToken?: string;
}
