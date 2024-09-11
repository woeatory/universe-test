import { Message } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { ApnsService } from 'src/apn/apn.service';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(private readonly apn: ApnsService) {}
  handle(messages: Message[]) {
    const message = messages[0];
    this.logger.log(message);
    this.apn.sendPushNotification('token', {
      title: message.MessageId,
      body: message.Body,
    });
  }
}
