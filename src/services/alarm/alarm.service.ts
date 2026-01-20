import { Injectable } from '@nestjs/common';
import { HALF_AN_HOUR_MS } from './constants/time';

@Injectable()
export class AlarmService {
  async isAlarmGone(date: Date): Promise<boolean> {
    return new Date().getTime() - date.getTime() > HALF_AN_HOUR_MS;
  }
}
