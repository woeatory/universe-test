import { Module } from '@nestjs/common';
import { UserModule } from './user/application/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    PrometheusModule.register({ defaultMetrics: { enabled: false } }),
    UserModule,
  ],
})
export class AppModule {}
