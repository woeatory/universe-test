import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService {
  private readonly sqsClient: SQSClient;
  private readonly logger: Logger = new Logger(SqsService.name);
  @Inject('SQS_QUEUE_URL') private readonly QueueUrl: string;
  constructor(private readonly configService: ConfigService) {
    this.sqsClient = new SQSClient({
      region: this.configService.get('aws_region'),
      credentials: {
        accessKeyId: this.configService.get('aws_access_key_id'),
        secretAccessKey: this.configService.get('aws_secret_access_key'),
      },
    });
  }

  async sendMessage(message: string, delay: number) {
    const params: SendMessageCommandInput = {
      DelaySeconds: delay,
      QueueUrl: this.QueueUrl,
      MessageBody: message,
    };

    const command = new SendMessageCommand(params);
    return await this.sqsClient.send(command);
  }
}
