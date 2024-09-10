import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { requestTimeProvider } from './request-time.provider';
import { RequestTimeInterceptor } from './request-time.interceptor';

@Module({
  imports: [PrometheusModule.register({ defaultMetrics: { enabled: false } })],
  providers: [requestTimeProvider, RequestTimeInterceptor],
})
export class MetricsModule {}
