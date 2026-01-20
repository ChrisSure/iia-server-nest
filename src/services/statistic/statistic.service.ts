import { Injectable } from '@nestjs/common';
import { AlarmRecord } from '../../repositories/alarm/interface/alarm.interface';
import { MaxValue } from './interfaces/maxValue.interface';
import { Statistic } from './interfaces/statistic.interface';

@Injectable()
export class StatisticService {
  async getReport(alarms: AlarmRecord[]): Promise<Statistic> {
    const hoursData = [];
    const daysData = [];
    const lastAlarms = alarms.slice(-50);
    lastAlarms.forEach((alarm) => {
      const date = new Date(alarm.date);
      hoursData.push(date.getUTCHours());
      daysData.push(date.getUTCDay());
    });
    const groupedHours: any = await this.groupValues(hoursData);
    const firstMaxHour: MaxValue = await this.getMaxValue(groupedHours);
    const secondMaxHour: MaxValue = await this.getSecondMaxHour(
      groupedHours,
      firstMaxHour,
    );

    const groupedDays: any = await this.groupValues(daysData);
    const maxDay: MaxValue = await this.getMaxValue(groupedDays);

    return {
      firstMaxHour: firstMaxHour.value,
      secondMaxHour: secondMaxHour.value,
      maxDay: maxDay.value,
    };
  }

  async getMaxValue(groupedValues: any): Promise<MaxValue> {
    let value = 0;
    let count = 0;
    groupedValues.forEach((r) => {
      if (!count || count < r.length) {
        value = r[0];
        count = r.length;
      }
    });
    return { value, count };
  }

  async getSecondMaxHour(
    groupedHours: any,
    firstMaxHour: MaxValue,
  ): Promise<MaxValue> {
    let value = 0;
    let count = 0;
    groupedHours.forEach((r) => {
      if (r[0] !== firstMaxHour.value && count < r.length) {
        value = r[0];
        count = r.length;
      }
    });
    return { value, count };
  }

  async groupValues(data): Promise<any> {
    return data.reduce((acc, value) => {
      if (!acc[value]) {
        acc[value] = [];
      }
      acc[value].push(value);
      return acc;
    }, []);
  }
}
