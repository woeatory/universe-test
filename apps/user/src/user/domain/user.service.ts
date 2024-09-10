import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { randomBytes, createHmac } from 'node:crypto';
import type { BinaryLike, KeyObject } from 'node:crypto';

const SALT = randomBytes(16);

const hash = (password: string, salt: BinaryLike | KeyObject) =>
  createHmac('sha512', salt).update(password).digest('hex');

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async createUser(data: { email: string; password: string }) {
    const passwordHash = hash(data.password, SALT);
    const { email } = data;
    await this.userRepository.createUser({
      email,
      passwordHash,
    });
  }
}
