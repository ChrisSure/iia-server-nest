import { Injectable } from '@nestjs/common';

@Injectable()
export class AlarmService {
  async isAlarmGone(date: Date): Promise<boolean> {
    const halfAnHour = 1800000;
    return new Date().getTime() - date.getTime() > halfAnHour;
  }
}
