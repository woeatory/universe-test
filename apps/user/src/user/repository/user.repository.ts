import { User } from '@prisma/client';

export abstract class UserRepository {
  abstract createUser(data: {
    email: string;
    passwordHash: string;
  }): Promise<User>;
}
