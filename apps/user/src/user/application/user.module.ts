import { Module } from '@nestjs/common';
import { UserService } from '../domain/user.service';
import { UserController } from '../presentation/user.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from '../repository/user.repository';
import { PrismaUserRepository } from '../repository/prisma/user.repository';
import { requestTimeProvider } from 'src/prometheus/request-time.provider';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    requestTimeProvider,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
