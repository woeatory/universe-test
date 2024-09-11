import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteMessageCommand,
  DeleteMessageCommandInput,
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
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

  async receiveMessage() {
    const params: ReceiveMessageCommandInput = {
      QueueUrl: this.QueueUrl,
      WaitTimeSeconds: 10,
      MaxNumberOfMessages: 1,
    };

    const command = new ReceiveMessageCommand(params);
    return await this.sqsClient.send(command);
  }

  async deleteMessage(receipt: string) {
    const params: DeleteMessageCommandInput = {
      QueueUrl: this.QueueUrl,
      ReceiptHandle: receipt,
    };
    const command = new DeleteMessageCommand(params);
    await this.sqsClient.send(command);
  }
}
