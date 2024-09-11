import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { SqsService } from 'src/sqs/sqs.service';
import { UserService } from '../domain/user.service';
import { ReceiveMessageCommandOutput } from '@aws-sdk/client-sqs';

@Injectable()
export class UserPoller implements OnModuleInit, OnModuleDestroy {
  private intervalId: string | number | NodeJS.Timeout;
  constructor(
    private readonly sqsService: SqsService,
    private readonly userService: UserService,
  ) {}
  private async pool() {
    this.intervalId = setInterval(async () => {
      const response: ReceiveMessageCommandOutput =
        await this.sqsService.receiveMessage();
      if (response.Messages !== undefined) {
        this.userService.handle(response.Messages);
        this.sqsService.deleteMessage(response.Messages[0].ReceiptHandle);
      }
    });
  }

  onModuleInit() {
    this.pool();
  }
  onModuleDestroy() {
    clearInterval(this.intervalId);
  }
}
