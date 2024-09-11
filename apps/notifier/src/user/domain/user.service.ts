import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);
  handle(message) {
    this.logger.log(message);
  }
}
