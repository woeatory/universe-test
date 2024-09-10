import { makeHistogramProvider } from '@willsoto/nestjs-prometheus';

export const requestTimeProvider = makeHistogramProvider({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'status_code'],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5],
});
