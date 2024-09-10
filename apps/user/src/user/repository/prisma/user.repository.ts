import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from '../user.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
  }): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email: data.email,
        password_hash: data.passwordHash,
      },
    });
  }
}
