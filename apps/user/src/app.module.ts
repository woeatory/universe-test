import { Module } from '@nestjs/common';
import { UserModule } from './user/application/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UserModule,
  ],
})
export class AppModule {}
