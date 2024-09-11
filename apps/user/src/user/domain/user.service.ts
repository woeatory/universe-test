import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { randomBytes, createHmac } from 'node:crypto';
import type { BinaryLike, KeyObject } from 'node:crypto';
import { SqsService } from 'src/sqs/sqs.service';

const SALT = randomBytes(16);

const hash = (password: string, salt: BinaryLike | KeyObject) =>
  createHmac('sha512', salt).update(password).digest('hex');

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sqsService: SqsService,
  ) {}
  async createUser(data: { email: string; password: string; delay: number }) {
    const passwordHash = hash(data.password, SALT);
    const { email } = data;
    try {
      await this.userRepository.createUser({
        email,
        passwordHash,
      });
      this.sqsService.sendMessage(`User ${email} created`, data.delay);
    } catch (error) {}
  }
}
