import { Module } from '@nestjs/common';
import { SqsService } from 'src/sqs/sqs.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserPoller } from './presentation/user.poller';
import { UserService } from './domain/user.service';

@Module({
  imports: [ConfigModule],
  providers: [
    UserPoller,
    UserService,
    SqsService,
    {
      provide: 'SQS_QUEUE_URL',
      useFactory: (configService: ConfigService) =>
        configService.get('SQS_QUEUE_URL'),
      inject: [ConfigService],
    },
  ],
})
export class UserModule {}
