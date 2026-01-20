import { StatisticService } from '../statistic.service';
import { Statistic } from '../interfaces/statistic.interface';
import { MaxValue } from '../interfaces/maxValue.interface';
import { AlarmRecord } from '../../../repositories/alarm/interface/alarm.interface';

describe('StatisticService', () => {
  const service: StatisticService = new StatisticService();
  const statistic: Statistic = {
    firstMaxHour: 8,
    secondMaxHour: 10,
    maxDay: 3,
  };
  const alarms: AlarmRecord[] = [
    { date: new Date('2022-10-26T08:14:00.108Z') },
    { date: new Date('2022-10-26T12:14:00.108Z') },
    { date: new Date('2022-10-26T08:14:00.108Z') },
    { date: new Date('2022-10-26T10:14:00.108Z') },
    { date: new Date('2022-10-26T08:14:00.108Z') },
    { date: new Date('2022-10-26T10:14:00.108Z') },
  ];
  const groupedValues = [
    [0],
    [1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2],
    [3, 3, 3],
    [4, 4, 4],
  ];

  it('getReport', async () => {
    const response: Statistic = await service.getReport(alarms);
    expect(response).toEqual(statistic);
  });

  it('getMaxValue', async () => {
    const response: MaxValue = await service.getMaxValue(groupedValues);
    expect(response.count).toEqual(6);
    expect(response.value).toEqual(1);
  });

  it('getSecondMaxHour', async () => {
    const firstMaxHour: MaxValue = { count: 6, value: 1 };
    const response: MaxValue = await service.getSecondMaxHour(
      groupedValues,
      firstMaxHour,
    );
    expect(response.count).toEqual(4);
    expect(response.value).toEqual(2);
  });

  it('groupValues', async () => {
    const data: any = [1, 0, 3, 1, 2, 2, 0, 1, 1];
    const expectedResult = [[0, 0], [1, 1, 1, 1], [2, 2], [3]];
    const response: MaxValue = await service.groupValues(data);
    expect(response).toEqual(expectedResult);
  });
});
