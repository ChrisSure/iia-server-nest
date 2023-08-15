import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Unit } from '../../repositories/unit/interface/unit.interface';

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
    if (result !== lastResult && level !== '') {
      const message = await this.generateMessage(level, result);
      const link = await this.getConnectionLink(message);
      if (link) {
        axios
          .get(link)
          .then()
          .catch(function (error) {
            console.log(error, 'Error while send message to Telegram');
          });
      }
    }
  }

  async isFastAlarm(result: number, lastUnit: Unit): Promise<boolean> {
    return result === 100 && lastUnit.point < 40;
  }

  async getNotificationLevel(
    result: number,
    lastResult: number,
    isFastResult: boolean,
  ): Promise<string> {
    if (result < 40 && lastResult >= 40 && lastResult !== 100) {
      return 'low';
    }

    if (result >= 40 && result < 80 && (lastResult >= 80 || lastResult < 40)) {
      return 'average';
    }

    if (result >= 80 && result < 100 && lastResult < 80) {
      return 'high';
    }

    if (result !== 100 && lastResult === 100) {
      return 'rebound';
    }

    if (result === 100 && lastResult !== 100 && !isFastResult) {
      return 'alarm';
    }

    if (result === 100 && lastResult !== 100 && isFastResult) {
      return 'alarm-fast';
    }
    return '';
  }

  async generateMessage(level: string, result: number): Promise<string> {
    let message = '';
    switch (level) {
      case 'low':
        message = `Імовірність Повітряної Тривоги - НИЗЬКА(${result}%)`;
        break;
      case 'average':
        message = `Імовірність Повітряної Тривоги - СЕРЕДНЯ(${result}%)`;
        break;
      case 'high':
        message = `Імовірність Повітряної Тривоги - ВИСОКА(${result}%)`;
        break;
      case 'rebound':
        message = '🇺🇦 Відбій повітряної тривоги 🇺🇦';
        break;
      case 'alarm':
        message = '🙏 Увага Оголошена Повітряна Тривога 🙏';
        break;
      case 'alarm-fast':
        message =
          '🛫 Повітряна тривога спровокована злетом носія ракети кинжал 🛫';
        break;
    }
    return message;
  }

  async getConnectionLink(message: string): Promise<string> {
    return process.env.ENV === 'stage' || process.env.ENV === 'prod'
      ? encodeURI(
          `https://api.telegram.org/bot5504688883:AAH1yOYmG8fxn_vYD3ZJFQn1LWF75m2NI_Y/sendMessage?chat_id=-1001615018661&text=${message}`,
        )
      : null;
  }
}
