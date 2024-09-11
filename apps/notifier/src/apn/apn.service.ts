import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as apn from 'apn';

@Injectable()
export class ApnsService {
  private readonly logger = new Logger(ApnsService.name);
  private apnProvider: apn.Provider;

  constructor(private readonly configService: ConfigService) {
    const apnOptions = {
      token: {
        key: this.configService.get<string>('APNS_KEY_PATH'),
        keyId: this.configService.get<string>('APNS_KEY_ID'),
        teamId: this.configService.get<string>('APNS_TEAM_ID'),
      },
      production: this.configService.get<boolean>('APNS_IS_PRODUCTION', false),
    };

    this.apnProvider = new apn.Provider(apnOptions);
  }

  async sendPushNotification(
    deviceToken: string,
    payload: { title: string; body: string },
  ) {
    const notification = new apn.Notification();

    notification.alert = {
      title: payload.title,
      body: payload.body,
    };
    notification.sound = 'default';
    notification.topic = this.configService.get<string>('APNS_BUNDLE_ID');

    try {
      const result = await this.apnProvider.send(notification, deviceToken);
      if (result.failed.length > 0) {
        result.failed.forEach((failure) => {
          this.logger.error(
            `Failed to send notification to ${failure.device}: ${failure.response?.reason}`,
          );
        });
      } else {
        this.logger.log('Notification sent successfully');
      }
    } catch (error) {
      this.logger.error(`Error sending notification: ${error.message}`);
    }
  }

  onModuleDestroy() {
    this.apnProvider.shutdown();
  }
}
