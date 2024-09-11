import { Module } from '@nestjs/common';
import { UserService } from '../domain/user.service';
import { UserController } from '../presentation/user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from '../repository/user.repository';
import { PrismaUserRepository } from '../repository/prisma/user.repository';
import { requestTimeProvider } from 'src/prometheus/request-time.provider';
import { SqsService } from 'src/sqs/sqs.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [UserController],
  providers: [
    SqsService,
    {
      provide: 'SQS_QUEUE_URL',
      useFactory: (configService: ConfigService) =>
        configService.get('SQS_QUEUE_URL'),
      inject: [ConfigService],
    },
    UserService,
    requestTimeProvider,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
