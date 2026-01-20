import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Unit } from '../../repositories/unit/interface/unit.interface';
import { TELEGRAM_CHAT } from '../../constants/global';
import { NotificationLevel } from './enums/notification-level.enum';
import { NOTIFICATION_MESSAGES, PERCENTAGE_SYMBOL } from './constants/messages';
import { TELEGRAM_SEND_ERROR } from './constants/errors';
import {
  ALARM_PROBABILITY_LOW_THRESHOLD,
  ALARM_PROBABILITY_HIGH_THRESHOLD,
  ALARM_PROBABILITY_MAX,
} from './constants/thresholds';

@Injectable()
export class MessengerService {
  async telegramNotify(
    result: number,
    lastResult: number,
    lastUnitRecent: Unit,
  ): Promise<void> {
    const isFastResult = await this.isFastAlarm(result, lastUnitRecent);
    const level = await this.getNotificationLevel(
      result,
      lastResult,
      isFastResult,
    );
    if (result !== lastResult && level !== NotificationLevel.NONE) {
      const message = await this.generateMessage(level, result);
      const link = await this.getConnectionLink(message);
      if (link) {
        axios
          .get(link)
          .then()
          .catch(function (error) {
            console.log(error, TELEGRAM_SEND_ERROR);
          });
      }
    }
  }

  async isFastAlarm(result: number, lastUnit: Unit): Promise<boolean> {
    return (
      result === ALARM_PROBABILITY_MAX &&
      lastUnit.point < ALARM_PROBABILITY_LOW_THRESHOLD
    );
  }

  async getNotificationLevel(
    result: number,
    lastResult: number,
    isFastResult: boolean,
  ): Promise<NotificationLevel> {
    if (
      result < ALARM_PROBABILITY_LOW_THRESHOLD &&
      lastResult >= ALARM_PROBABILITY_LOW_THRESHOLD &&
      lastResult !== ALARM_PROBABILITY_MAX
    ) {
      return NotificationLevel.LOW;
    }

    if (
      result >= ALARM_PROBABILITY_LOW_THRESHOLD &&
      result < ALARM_PROBABILITY_HIGH_THRESHOLD &&
      (lastResult >= ALARM_PROBABILITY_HIGH_THRESHOLD ||
        lastResult < ALARM_PROBABILITY_LOW_THRESHOLD)
    ) {
      return NotificationLevel.AVERAGE;
    }

    if (
      result >= ALARM_PROBABILITY_HIGH_THRESHOLD &&
      result < ALARM_PROBABILITY_MAX &&
      lastResult < ALARM_PROBABILITY_HIGH_THRESHOLD
    ) {
      return NotificationLevel.HIGH;
    }

    if (
      result !== ALARM_PROBABILITY_MAX &&
      lastResult === ALARM_PROBABILITY_MAX
    ) {
      return NotificationLevel.REBOUND;
    }

    if (
      result === ALARM_PROBABILITY_MAX &&
      lastResult !== ALARM_PROBABILITY_MAX &&
      !isFastResult
    ) {
      return NotificationLevel.ALARM;
    }

    if (
      result === ALARM_PROBABILITY_MAX &&
      lastResult !== ALARM_PROBABILITY_MAX &&
      isFastResult
    ) {
      return NotificationLevel.ALARM_FAST;
    }
    return NotificationLevel.NONE;
  }

  async generateMessage(
    level: NotificationLevel,
    result: number,
  ): Promise<string> {
    const baseMessage = NOTIFICATION_MESSAGES[level];

    if (
      level === NotificationLevel.LOW ||
      level === NotificationLevel.AVERAGE ||
      level === NotificationLevel.HIGH
    ) {
      return `${baseMessage}(${result}${PERCENTAGE_SYMBOL})`;
    }

    return baseMessage;
  }

  async getConnectionLink(message: string): Promise<string> {
    return process.env.ENV === 'stage' || process.env.ENV === 'prod'
      ? encodeURI(`${TELEGRAM_CHAT}${message}`)
      : null;
  }
}
