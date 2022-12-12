import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MessengerService {
  async telegramNotify(result: number, lastResult: number): Promise<void> {
    const level = await this.getNotificationLevel(result, lastResult);
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

  async getNotificationLevel(
    result: number,
    lastResult: number,
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

    if (result === 100 && lastResult !== 100) {
      return 'alarm';
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
